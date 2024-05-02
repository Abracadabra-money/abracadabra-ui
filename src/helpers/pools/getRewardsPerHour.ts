import { formatUnits } from "viem";
import store from "@/store";
import type { PoolInfo } from "@/configs/pools/types";
import type { PointsStatistics } from "@/helpers/blast/stake/points";

export type RewardsPerHour = {
  pointsReward: number;
  goldReward: number;
};

export const getRewardsPerHour = async (
  pool: PoolInfo,
  pointsStatistics: PointsStatistics,
  deposit: number = 0
) => {
  let pointsReward = 0;
  let goldReward = 0;

  const publicClient = store.getters.getChainById(pool.chainId).publicClient;
  const pointsRate = pointsStatistics?.liquidityPoints?.lp?.pending || 0;
  const goldRate = pointsStatistics?.developerPoints?.lp?.pending || 0;
  const total =
    Number(formatUnits(pool.totalSupply, pool.decimals)) * pool.price;

  try {
    const lockedSupply: any = await publicClient.readContract({
      address: pool.lockContract?.address,
      abi: pool.lockContract?.abi,
      functionName: "lockedSupply",
    });

    const locked =
      Number(formatUnits(lockedSupply, pool.decimals)) * pool.price;

    const staked = total - locked;

    pointsReward = (pointsRate / (staked + deposit)) * deposit;
    goldReward = (goldRate / (staked + deposit)) * deposit;
  } catch (error) {
    console.log("getRewardsPerHours error: ", error);
  }

  return {
    pointsReward,
    goldReward,
  };
};
