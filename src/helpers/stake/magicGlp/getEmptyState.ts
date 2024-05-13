import { formatUnits } from "viem";
import { BIPS } from "@/constants/global";
import { useImage } from "@/helpers/useImage";
import { MIM_PRICE, ONE_ETHER_VIEM } from "@/constants/global";
import { getPublicClient } from "@/helpers/chains/getChainsInfo";
import type { EmptyState } from "@/types/magicGlp/additionalInfo";
import { magicGlpConfig } from "@/configs/stake/magicGlp/magicGlpConfig";
import { ARBITRUM_CHAIN_ID, AVALANCHE_CHAIN_ID } from "@/constants/global";
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
    price: 0n,
    decimals: 18,
    totalSupply: 0n,
    totalSupplyUsd: 0n,
  },
  stakeToken: {
    name: stakeToken.name,
    icon: stakeToken.icon,
    balance: 0n,
    balanceUsd: 0n,
    price: 0n,
    rateIcon: useImage("assets/images/glp/mGlpNew.png"),
  },
};

export const getEmptyState = async (config: any, chainId: number) => {
  if (!config) return emptyState;
  const { rewardToken, leverageInfo } = config.additionalInfo;
  const { harvestor, chainLink, stakeToken, mainToken, oracle } = config;

  const currentChain =
    chainId === ARBITRUM_CHAIN_ID ? ARBITRUM_CHAIN_ID : AVALANCHE_CHAIN_ID;

  const publicClient = getPublicClient(currentChain);

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

  const stakeTokenPrice = (mainTokenPrice * ONE_ETHER_VIEM) / tokenRate;

  emptyState.mainToken.totalSupply = totalSupply.result;
  emptyState.mainToken.totalSupplyUsd = totalSupplyUsd;
  emptyState.mainToken.rate = tokenRate;
  emptyState.mainToken.price = mainTokenPrice;
  emptyState.stakeToken.price = stakeTokenPrice;

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
