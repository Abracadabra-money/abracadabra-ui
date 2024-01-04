import { BIPS } from "@/constants/global";
import { useImage } from "@/helpers/useImage";
import { arbitrum, avalanche } from "viem/chains";
import { ARBITRUM_CHAIN_ID } from "@/constants/global";
import { createPublicClient, formatUnits, http } from "viem";
import { magicGlpConfig } from "@/utils/stake/magicGlpConfig";
import { MIM_PRICE, ONE_ETHER_VIEM } from "@/constants/global";
import type { EmptyState } from "@/types/magicGlp/additionalInfo";
import { getTotalRewards } from "@/helpers/stake/magicGlp/subgraph/getTotalRewards";

const { mainToken, stakeToken } =
  magicGlpConfig[ARBITRUM_CHAIN_ID as keyof typeof magicGlpConfig];

const emptyState: EmptyState = {
  mainToken: {
    name: mainToken.name,
    icon: mainToken.icon,
    rateIcon: useImage("assets/images/glp/mGlpNew.png"),
    balance: 0n,
    balanceUsd: 0n,
    rate: ONE_ETHER_VIEM,
    decimals: 18,
    totalSupply: 0n,
    totalSupplyUsd: 0n,
  },
  stakeToken: {
    name: stakeToken.name,
    icon: stakeToken.icon,
    balance: 0n,
    balanceUsd: 0n,
    rateIcon: useImage("assets/images/glp/mGlpNew.png"),
  },
};

export const getEmptyState = async (config: any, chainId: number) => {
  if (!config) return emptyState;
  const { rewardToken, leverageInfo } = config.additionalInfo;
  const { harvestor, chainLink, stakeToken, mainToken, oracle } = config;

  // todo new chain config
  const publicClient = createPublicClient({
    chain: chainId === arbitrum.id ? arbitrum : avalanche,
    transport: http(),
  });

  const [
    totalSupply,
    oracleExchangeRate,
    magicGlpAmount,
    feePercentBips,
    rewardTokenPrice,
  ]: any = await publicClient.multicall({
    contracts: [
      {
        ...mainToken.contract,
        functionName: "totalSupply",
        args: [],
      },
      {
        ...oracle,
        functionName: "peekSpot",
        args: ["0x"],
      },
      {
        ...stakeToken.contract,
        functionName: "balanceOf",
        args: [mainToken.contract.address],
      },
      {
        ...harvestor,
        functionName: "feePercentBips",
        args: [],
      },
      {
        ...chainLink,
        functionName: "latestAnswer",
        args: [],
      },
    ],
  });

  const totalRewardsAmount = await getTotalRewards(chainId);
  const parseRewardTokenPrice = +formatUnits(rewardTokenPrice.result, 8);
  const totalRewardsAmountUsd = +totalRewardsAmount * parseRewardTokenPrice;

  const mainTokenPrice =
    (MIM_PRICE * ONE_ETHER_VIEM) / oracleExchangeRate.result;
  const totalSupplyUsd = (totalSupply.result * mainTokenPrice) / ONE_ETHER_VIEM;

  const tokenRate =
    (magicGlpAmount.result * ONE_ETHER_VIEM) / totalSupply.result;

  emptyState.mainToken.totalSupply = totalSupply.result;
  emptyState.mainToken.totalSupplyUsd = totalSupplyUsd;
  emptyState.mainToken.rate = tokenRate;

  return {
    chainId,
    ...emptyState,
    feePercent: feePercentBips.result / BIPS,
    rewardToken: {
      ...rewardToken,
      amount: totalRewardsAmount || "0",
      amountUsd: totalRewardsAmountUsd,
    },
    leverageInfo,
  };
};
