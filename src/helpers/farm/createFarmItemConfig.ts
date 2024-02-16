import { markRaw } from "vue";
import { getFarmYieldAndLpPrice } from "@/helpers/farm/getFarmYieldAndLpPrice";
import { getRoi } from "@/helpers/farm/getRoi";
import { getTVL } from "@/helpers/farm/getTVL";
import { getFarmUserInfo } from "@/helpers/farm/getFarmUserInfo";
import farmsConfig from "@/configs/farms/farms";
import type {
  FarmConfig,
  FarmItem,
  PoolInfo,
  ContractInfo,
} from "@/configs/farms/types";
import type { Address } from "viem";
import { tokensChainLink } from "@/configs/chainLink/config";
import { getTokenPriceByChain } from "@/helpers/prices/getTokenPriceByChain";
import { createMultiRewardFarm } from "./createMultiRewardFarm";
import { getPublicClient } from "@/helpers/getPublicClient";

export const createFarmItemConfig = async (
  farmId: number | string,
  chainId: number | string,
  account: Address | undefined,
  isExtended = true
): Promise<any> => {
  const farmsOnChain = farmsConfig.filter(
    (farm) => farm.contractChain == chainId
  );

  const farmInfo: FarmConfig | undefined = farmsOnChain.find(
    ({ id }) => id === Number(farmId)
  );

  if (!farmInfo) return null;

  const publicClient = getPublicClient(chainId);

  if (farmInfo.isMultiReward)
    return await createMultiRewardFarm(farmInfo, account);

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
    // @ts-ignore
    farmInfo.poolId,
    chainId,
    publicClient
  );

  const contractInfo = {
    address: farmInfo.contract.address,
    abi: farmInfo.contract.abi,
  };
  const stakingTokenContractInfo = {
    address: poolInfo.stakingToken,
    abi: farmInfo.stakingToken.abi,
  };

  const { farmYield, lpPrice }: any = await getFarmYieldAndLpPrice(
    stakingTokenContractInfo,
    contractInfo,
    poolInfo,
    farmInfo,
    MIMPrice,
    SPELLPrice,
    chainId,
    publicClient
  );

  const farmRoi = farmYield ? await getRoi(farmYield, SPELLPrice) : farmYield;

  const isDeprecated = farmRoi === 0;

  const farmItemConfig: FarmItem = {
    name: farmInfo.name,
    icon: farmInfo.icon,
    id: farmInfo.id,
    chainId: farmInfo.contractChain,
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
    isDeprecated,
  };

  if (isExtended)
    farmItemConfig.farmTvl = await getTVL(
      poolInfo.stakingTokenTotalAmount,
      lpPrice!
    );

  if (account) {
    farmItemConfig.accountInfo = await getFarmUserInfo(
      farmItemConfig,
      publicClient
    );
    return markRaw(farmItemConfig);
  }
  return markRaw(farmItemConfig);
};

const getPoolInfo = async (
  contract: ContractInfo,
  poolId: number,
  chainId: number | string,
  publicClient: any
): Promise<PoolInfo> => {
  const [
    stakingToken,
    stakingTokenTotalAmount,
    accIcePerShare,
    lastRewardTime,
    allocPoint,
  ]: any = await publicClient.readContract({
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
