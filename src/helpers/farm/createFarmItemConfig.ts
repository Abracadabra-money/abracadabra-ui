import { markRaw } from "vue";
import { getFarmYieldAndLpPrice } from "@/helpers/farm/getFarmYieldAndLpPrice";
import { getRoi } from "@/helpers/farm/getRoi";
import { getTVL } from "@/helpers/farm/getTVL";
import { getFarmUserInfo } from "@/helpers/farm/getFarmUserInfo";
import farmsConfig from "@/utils/farmsConfig/farms";
import type {
  FarmConfig,
  FarmItem,
  PoolInfo,
  ContractInfo,
} from "@/utils/farmsConfig/types";
import { readContract } from "@wagmi/core";
import type { Address } from "viem";
import { tokensChainLink } from "@/utils/chainLink/config";
import { getTokenPriceByChain } from "@/helpers/prices/getTokenPriceByChain";

export const createFarmItemConfig = async (
  farmId: number | string,
  chainId: number,
  account: Address | undefined,
  isExtended = true
): Promise<FarmItem | null> => {
  const farmsOnChain = farmsConfig.filter(
    (farm) => farm.contractChain === chainId
  );

  const farmInfo: FarmConfig | undefined = farmsOnChain.find(
    ({ id }) => id === Number(farmId)
  );

  if (!farmInfo) return null;

  const MIMPrice = await getTokenPriceByChain(
    tokensChainLink.mim.chainId,
    tokensChainLink.mim.address
  );

  const SPELLPrice = await getTokenPriceByChain(
    tokensChainLink.spell.chainId,
    tokensChainLink.spell.address
  );

  const poolInfo: PoolInfo = await getPoolInfo(
    farmInfo.contract,
    farmInfo.poolId,
    chainId
  );

  const contractInfo = {
    address: farmInfo.contract.address,
    abi: farmInfo.contract.abi,
  };
  const stakingTokenContractInfo = {
    address: poolInfo.stakingToken,
    abi: farmInfo.stakingToken.abi,
  };

  const { farmYield, lpPrice } = await getFarmYieldAndLpPrice(
    stakingTokenContractInfo,
    contractInfo,
    poolInfo,
    farmInfo,
    MIMPrice,
    SPELLPrice,
    chainId
  );

  const farmRoi = farmYield ? await getRoi(farmYield, SPELLPrice) : farmYield;

  const isDepreciated = farmRoi === 0;

  const farmItemConfig: FarmItem = {
    name: farmInfo.name,
    icon: farmInfo.icon,
    id: farmInfo.id,
    poolId: farmInfo.poolId,
    earnedTokenPrice: SPELLPrice,
    stakingToken: {
      link: farmInfo.stakingToken.link,
      name: farmInfo.stakingToken.name,
      type: farmInfo.stakingToken.type,
      contractInfo: {
        address: poolInfo.stakingToken,
        abi: farmInfo.stakingToken.abi,
      },
    },
    depositedBalance: farmInfo.depositedBalance,
    contractInfo,
    farmRoi,
    farmYield,
    lpPrice,
    isDepreciated,
  };

  if (isExtended)
    farmItemConfig.farmTvl = await getTVL(
      poolInfo.stakingTokenTotalAmount,
      lpPrice!
    );

  if (account) {
    farmItemConfig.accountInfo = await getFarmUserInfo(farmItemConfig);
    return markRaw(farmItemConfig);
  }
  return markRaw(farmItemConfig);
};

const getPoolInfo = async (
  contract: ContractInfo,
  poolId: number,
  chainId: number
): Promise<PoolInfo> => {
  const [
    stakingToken,
    stakingTokenTotalAmount,
    accIcePerShare,
    lastRewardTime,
    allocPoint,
  ]: any = await readContract({
    address: contract.address,
    abi: contract.abi,
    functionName: "poolInfo",
    args: [poolId],
    chainId,
  });
  return {
    stakingToken,
    stakingTokenTotalAmount,
    accIcePerShare,
    lastRewardTime,
    allocPoint,
  };
};
