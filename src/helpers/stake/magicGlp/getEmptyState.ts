import { BIPS } from "@/constants/global";
import { useImage } from "@/helpers/useImage";
import { formatUnits, parseUnits } from "viem";
import { MIM_PRICE, ONE_ETHER_VIEM } from "@/constants/global";
import { getPublicClient } from "@/helpers/chains/getChainsInfo";
import type { MagicGlpStakeInfo } from "@/helpers/stake/magicGlp/types";
import { magicGlpConfig } from "@/configs/stake/magicGlp/magicGlpConfig";
import { ARBITRUM_CHAIN_ID, AVALANCHE_CHAIN_ID } from "@/constants/global";
import type { ChainConfig } from "@/configs/stake/magicGlp/magicGlpConfig";
import { getTotalRewards } from "@/helpers/stake/magicGlp/subgraph/getTotalRewards";

const { mainToken, stakeToken, additionalInfo } =
  magicGlpConfig[ARBITRUM_CHAIN_ID as keyof typeof magicGlpConfig];

const emptyState: MagicGlpStakeInfo = {
  chainId: ARBITRUM_CHAIN_ID,
  feePercent: 0,
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
    contract: mainToken.contract,
  },
  stakeToken: {
    name: stakeToken.name,
    icon: stakeToken.icon,
    balance: 0n,
    balanceUsd: 0n,
    price: 0n,
    rateIcon: useImage("assets/images/glp/mGlpNew.png"),
    decimals: stakeToken.decimals,
    contract: stakeToken.contract,
    approvedAmount: 0n,
  },
  rewardToken: {
    ...additionalInfo.rewardToken,
    amount: 0n,
    amountUsd: 0n,
  },
  leverageInfo: additionalInfo.leverageInfo,
};

export const getEmptyState = async (
  config: ChainConfig,
  chainId: number
): Promise<MagicGlpStakeInfo> => {
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
  ] = await publicClient.multicall({
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
  const parseRewardTokenPrice = +formatUnits(
    rewardTokenPrice.result as bigint,
    8
  );
  const totalRewardsAmountUsd = +totalRewardsAmount * parseRewardTokenPrice;

  const mainTokenPrice = ((MIM_PRICE * ONE_ETHER_VIEM) /
    oracleExchangeRate.result) as bigint;
  const totalSupplyUsd =
    ((totalSupply.result as bigint) * mainTokenPrice) / ONE_ETHER_VIEM;

  const tokenRate =
    ((magicGlpAmount.result as bigint) * ONE_ETHER_VIEM) /
    (totalSupply.result as bigint);

  const stakeTokenPrice = (mainTokenPrice * ONE_ETHER_VIEM) / tokenRate;

  emptyState.chainId = chainId;
  emptyState.mainToken.rate = tokenRate;
  emptyState.leverageInfo = leverageInfo;
  emptyState.mainToken.price = mainTokenPrice;
  emptyState.stakeToken.price = stakeTokenPrice;
  emptyState.mainToken.totalSupplyUsd = totalSupplyUsd;
  emptyState.mainToken.totalSupply = totalSupply.result as bigint;
  emptyState.rewardToken = {
    ...rewardToken,
    amount: parseUnits(totalRewardsAmount.toString(), 18) || 0n,
    amountUsd: parseUnits(totalRewardsAmountUsd.toString(), 18) || 0n,
  };

  return {
    ...emptyState,
    feePercent: (feePercentBips.result as number) / BIPS,
  };
};
