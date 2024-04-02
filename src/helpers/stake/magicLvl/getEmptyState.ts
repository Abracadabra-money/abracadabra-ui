import { useImage } from "@/helpers/useImage";
import { MASTER_ADDRESS } from "@/constants/lvlFinance";
import { magicLvlConfig } from "@/configs/stake/magicLvlConfig";
import { getPublicClient } from "@/helpers/chains/getChainsInfo";
import type { MagicLvlStakeInfo } from "@/types/magicLvl/stakeInfo";
import { BSC_CHAIN_ID, MIM_PRICE, ONE_ETHER_VIEM } from "@/constants/global";
import { getAdditionalInfo } from "@/helpers/stake/magicLvl/getAdditionalInfo";

const {
  mainToken: seniorMainToken,
  stakeToken: seniorStakeToken,
  pid: jseniorPid,
}: any = magicLvlConfig[BSC_CHAIN_ID as keyof typeof magicLvlConfig]
  .tokensConfig[0];

const {
  mainToken: mezzanineMainToken,
  stakeToken: mezzanineStakeToken,
  pid: mezzaninePid,
}: any = magicLvlConfig[BSC_CHAIN_ID as keyof typeof magicLvlConfig]
  .tokensConfig[1];

const {
  mainToken: juniorMainToken,
  stakeToken: juniorStakeToken,
  pid: juniorPid,
}: any = magicLvlConfig[BSC_CHAIN_ID as keyof typeof magicLvlConfig]
  .tokensConfig[2];

const emptyState: any = {
  chainId: 56,
  junior: {
    name: "Junior",
    tokensRate: ONE_ETHER_VIEM,
    feePercent: 0.1,
    levelMasterContract: {
      address: MASTER_ADDRESS,
      abi: "",
    },
    mainToken: {
      name: juniorMainToken.name,
      icon: juniorMainToken.icon,
      decimals: juniorMainToken.decimals,
      contract: juniorMainToken.contract,
      balance: 0n,
      totalSupplyUsd: ONE_ETHER_VIEM,
      price: 0n,
    },
    stakeToken: {
      name: juniorStakeToken.name,
      icon: juniorStakeToken.icon,
      decimals: juniorStakeToken.decimals,
      contract: juniorStakeToken.contract,
      walletBalance: 0n,
      balance: 0n,
      pid: juniorPid,
      approvedAmount: 0n,
      price: 0n,
      rateIcon: useImage("assets/images/stake/junior-icon.svg"),
    },
  },
  mezzanine: {
    name: "Mezzanine",
    tokensRate: ONE_ETHER_VIEM,
    feePercent: 0.1,
    levelMasterContract: {
      address: MASTER_ADDRESS,
      abi: "",
    },
    mainToken: {
      name: mezzanineMainToken.name,
      icon: mezzanineMainToken.icon,
      decimals: mezzanineMainToken.decimals,
      contract: mezzanineMainToken.contract,
      balance: 0n,
      totalSupplyUsd: ONE_ETHER_VIEM,
      price: 0n,
    },
    stakeToken: {
      name: mezzanineStakeToken.name,
      icon: mezzanineStakeToken.icon,
      decimals: mezzanineStakeToken.decimals,
      contract: mezzanineStakeToken.contract,
      walletBalance: 0n,
      balance: 0n,
      pid: mezzaninePid,
      price: 0n,
      approvedAmount: 0n,
      rateIcon: useImage("assets/images/stake/mezzanine-icon.svg"),
    },
  },
  senior: {
    name: "Senior",
    tokensRate: ONE_ETHER_VIEM,
    feePercent: 0.01,
    levelMasterContract: {
      address: MASTER_ADDRESS,
      abi: "",
    },
    mainToken: {
      name: seniorMainToken.name,
      icon: seniorMainToken.icon,
      decimals: seniorMainToken.decimals,
      contract: seniorMainToken.contract,
      balance: 0n,
      totalSupplyUsd: ONE_ETHER_VIEM,
      price: 0n,
    },
    stakeToken: {
      name: seniorStakeToken.name,
      icon: seniorStakeToken.icon,
      decimals: seniorStakeToken.decimals,
      contract: seniorStakeToken.contract,
      walletBalance: 0n,
      balance: 0n,
      pid: jseniorPid,
      price: 0n,
      approvedAmount: 0n,
      rateIcon: useImage("assets/images/stake/senior-icon.svg"),
    },
  },
};

const getTokenInfo = async (config: any) => {
  const publicClient = getPublicClient(BSC_CHAIN_ID);

  const [oracleRate, tokenRate, totalSupply]: any =
    await publicClient.multicall({
      contracts: [
        {
          ...config.oracle,
          functionName: "peekSpot",
          args: ["0x"],
        },
        {
          ...config.mainToken.contract,
          functionName: "convertToAssets",
          args: [ONE_ETHER_VIEM],
        },
        {
          ...config.mainToken.contract,
          functionName: "totalSupply",
          args: [],
        },
      ],
    });

  const stakeTokenPrice = (MIM_PRICE * ONE_ETHER_VIEM) / oracleRate.result;
  const mainTokenPrice = (stakeTokenPrice * tokenRate.result) / ONE_ETHER_VIEM;
  const totalSupplyUsd = (totalSupply.result * mainTokenPrice) / ONE_ETHER_VIEM;

  return {
    name: config.name,
    totalSupplyUsd: totalSupplyUsd,
    tokensRate: tokenRate.result,
    stakeTokenPrice,
    mainTokenPrice,
  };
};

export const getEmptyState = async (
  config: any,
  chainId: number
): Promise<MagicLvlStakeInfo> => {
  if (!config) return emptyState;

  const tokensInfo = await Promise.all(
    config.tokensConfig.map(async (config: any) => {
      return await getTokenInfo(config);
    })
  );

  tokensInfo.map((info: any) => {
    emptyState[info.name as keyof typeof emptyState]!.mainToken.totalSupplyUsd =
      info.totalSupplyUsd;
    emptyState[info.name as keyof typeof emptyState]!.tokensRate =
      info.tokensRate;
    emptyState[info.name as keyof typeof emptyState]!.mainToken.price =
      info.mainTokenPrice;
    emptyState[info.name as keyof typeof emptyState]!.stakeToken.price =
      info.stakeTokenPrice;
  });

  const additionalInfo = await getAdditionalInfo(emptyState);

  return { chainId, ...emptyState, ...additionalInfo };
};
