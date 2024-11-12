import type { TokenConfig } from "@/configs/pools/types";
import { type Address, formatUnits } from "viem";
import { getPublicClient } from "@/helpers/chains/getChainsInfo";
import { getCoinsPrices, type TokenPrice } from "@/helpers/prices/defiLlama";

export const getPoolApr = async (
  chainId: number,
  poolInfo: any,
  tokensPrices?: TokenPrice[]
) => {
  try {
    const publicClient = getPublicClient(chainId);

    const rewardTokensInfo = await getRewardTokensInfo(poolInfo, tokensPrices);

    const stakingTokenPrice = poolInfo.price;

    const totalStakedInUSD =
      Number(formatUnits(poolInfo.stakedTotalSupply, poolInfo.decimals)) *
      stakingTokenPrice;

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
        price: tokenInfo.price,
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

const getRewardTokensInfo = async (
  poolConfig: any,
  tokensPrices?: TokenPrice[]
) => {
  const rewardTokens = poolConfig.rewardTokens;
  if (!rewardTokens) return [];

  let rewardTokensPrices: TokenPrice[];

  if (tokensPrices) {
    rewardTokensPrices = tokensPrices.filter(({ address }) =>
      rewardTokens.some(
        (token: TokenConfig) => token.contract.address === address
      )
    );
  } else {
    const tokenAddresses = poolConfig.rewardTokens.reduce(
      (acc: Address[], token: TokenConfig) => acc.push(token.contract.address),
      []
    );

    rewardTokensPrices = await getCoinsPrices(
      poolConfig.chainId,
      tokenAddresses
    );
  }

  return poolConfig.rewardTokens.map((token: TokenConfig, index: number) => {
    return { ...token, price: rewardTokensPrices[index].price || 0 };
  });
};
