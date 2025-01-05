import { type Address, formatUnits } from "viem";
import { getPublicClient } from "@/helpers/chains/getChainsInfo";
import type { RewardTokenInfo, AprInfo } from "@/helpers/bSpell/types";

export const getBSpellApr = async (
  chainId: number,
  rewardTokensInfo: RewardTokenInfo[],
  stakedTotalSupply: bigint,
  stakeContract: { address: Address; abi: any },
  stakingTokenPrice: number
): Promise<AprInfo> => {
  const publicClient = getPublicClient(chainId);

  const totalStakedInUSD =
    Number(formatUnits(stakedTotalSupply, 18)) * stakingTokenPrice;

  let totalAnnualRewardsInUSD = 0;
  const tokensApr = [] as {
    address: Address;
    apr: number;
    price: number;
    icon: string;
    name: string;
  }[];

  for (const tokenInfo of rewardTokensInfo) {
    const rewardData = await publicClient.readContract({
      address: stakeContract.address,
      abi: stakeContract.abi,
      functionName: "rewardData",
      args: [tokenInfo.contract.address],
    });

    const rewardTokenPrice = tokenInfo.price;

    const isPeriodFinish =
      Number(rewardData.periodFinish) <= Math.floor(Number(new Date()) / 1000);

    const rewardRate =
      Number(formatUnits(rewardData.rewardRate, 18)) * (365 * 24 * 60 * 60);

    const annualReward = isPeriodFinish ? 0 : rewardRate * rewardTokenPrice;

    const tokenApr = (annualReward / totalStakedInUSD) * 100;

    tokensApr.push({
      address: tokenInfo.contract.address,
      apr: tokenApr,
      price: tokenInfo.price,
      icon: tokenInfo.icon,
      name: tokenInfo.name,
    });

    totalAnnualRewardsInUSD += annualReward;
  }

  const totalApr = (totalAnnualRewardsInUSD / totalStakedInUSD) * 100;

  return { totalApr, tokensApr };
};
