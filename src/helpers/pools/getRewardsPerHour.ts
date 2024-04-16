import { fetchPointsStatistics } from "@/helpers/blast/stake/points";
import { formatUnits } from "viem";
import store from "@/store";

export const getRewardsPerHour = async (pool: any, deposit = 0) => {
  const publicClient = store.getters.getChainById(pool.chainId).publicClient;

  const pointsStatistics = await fetchPointsStatistics();

  const pointsRate = pointsStatistics?.liquidityPoints?.lp?.pending || 0;

  const goldRate = pointsStatistics?.developerPoints?.lp?.pending || 0;

  const total =
    Number(formatUnits(pool.totalSupply, pool.decimals)) * pool.price;

  const lockedSupply: any = await publicClient.readContract({
    address: pool.lockContract.address,
    abi: pool.lockContract.abi,
    functionName: "lockedSupply",
  });

  const locked = Number(formatUnits(lockedSupply, pool.decimals)) * pool.price;

  const staked = total - locked;

  const pointsReward = (pointsRate / (staked + deposit)) * deposit;
  const goldReward = (goldRate / (staked + deposit)) * deposit;

  return {
    pointsReward,
    goldReward,
  };
};
