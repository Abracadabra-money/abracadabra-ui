import type { TokenConfig } from "@/configs/pools/types";
import { type Address, formatUnits } from "viem";
import { getPublicClient } from "@/helpers/chains/getChainsInfo";
import { getCoinsPrices } from "@/helpers//prices/defiLlama";

export const getPoolApr = async (chainId: number, poolInfo: any) => {
  try {
    const publicClient = getPublicClient(chainId);

    const rewardTokensInfo = await getTokenPrices(poolInfo);

    const stakingTokenPrice = poolInfo.price;

    const totalStakedInUSD =
      Number(formatUnits(poolInfo.totalSupply, 18)) * stakingTokenPrice;

    let totalAnnualRewardsInUSD = 0;
    const tokensApr = [];

    const stakeContract = poolInfo.stakeContract;

    for (const tokenInfo of rewardTokensInfo) {
      const rewardData = await publicClient.readContract({
        address: stakeContract!.address,
        abi: stakeContract!.abi,
        functionName: "rewardData",
        args: [tokenInfo.contract.address],
      });

      const rewardTokenPrice = tokenInfo.price;

      const annualReward =
        //@ts-ignore
        Number(rewardData.periodFinish) <= Math.floor(new Date() / 1000)
          ? 0
          : //@ts-ignore
            formatUnits(rewardData.rewardRate, 18) *
            (365 * 24 * 60 * 60) *
            // rewardData.rewardsDuration *
            rewardTokenPrice;

      const tokenApr = (annualReward / totalStakedInUSD) * 100;

      tokensApr.push({
        address: tokenInfo.contract.address,
        apr: tokenApr,
      });

      totalAnnualRewardsInUSD += annualReward;
    }

    const totalApr = (totalAnnualRewardsInUSD / totalStakedInUSD) * 100;

    return { totalApr, tokensApr };
  } catch (error) {
    console.error("Error calculating APR:", error);
    return { totalApr: 0, tokensApr: 0 };
  }
};

const getTokenPrices = async (config: any) => {
  const tokenAddresses: Address[] = [];
  const rewardTokens = config.rewardTokens;

  if (!rewardTokens) return [];

  config.rewardTokens.forEach((token: TokenConfig) =>
    tokenAddresses.push(token.contract.address)
  );

  const prices = await getCoinsPrices(config.chainId, tokenAddresses);

  return config.rewardTokens.map((token: TokenConfig, index: number) => {
    return { ...token, price: prices[index].price || 0 };
  });
};
