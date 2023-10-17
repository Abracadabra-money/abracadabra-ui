import type { MagicLvlStakeInfo } from "@/types/magicLvl/stakeInfo";
import type { MagicLvlTranchesInfo } from "@/types/magicLvl/stakeInfo";
import { MASTER_ADDRESS } from "@/constants/lvlFinance";
import { magicLvlConfig } from "@/utils/stake/magicLvlConfig";
import { getAdditionalInfo } from "@/helpers/stake/magicLvl/getAdditionalInfo";
import { bsc } from "viem/chains";
import { createPublicClient, http } from "viem";
import { BSC_CHAIN_ID, MIM_PRICE, ONE_ETHER_VIEM } from "@/constants/global";

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

const emptyState: MagicLvlTranchesInfo = {
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
      approvedAmount: 0n,
    },
    stakeToken: {
      name: juniorStakeToken.name,
      icon: juniorStakeToken.icon,
      decimals: juniorStakeToken.decimals,
      contract: juniorStakeToken.contract,
      walletBalance: 0n,
      balance: 0n,
      pid: juniorPid,
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
      approvedAmount: 0n,
    },
    stakeToken: {
      name: mezzanineStakeToken.name,
      icon: mezzanineStakeToken.icon,
      decimals: mezzanineStakeToken.decimals,
      contract: mezzanineStakeToken.contract,
      walletBalance: 0n,
      balance: 0n,
      pid: mezzaninePid,
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
      approvedAmount: 0n,
    },
    stakeToken: {
      name: seniorStakeToken.name,
      icon: seniorStakeToken.icon,
      decimals: seniorStakeToken.decimals,
      contract: seniorStakeToken.contract,
      walletBalance: 0n,
      balance: 0n,
      pid: jseniorPid,
    },
  },
};

const getTokenInfo = async (config: any) => {
  const publicClient = createPublicClient({
    chain: bsc,
    transport: http(),
  });

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
  };
};

export const getEmptyState = async (
  config: any
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
  });

  const additionalInfo = await getAdditionalInfo(emptyState);

  return { ...emptyState, ...additionalInfo };
};
