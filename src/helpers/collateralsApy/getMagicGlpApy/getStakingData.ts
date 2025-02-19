import {
  rewardTrackers,
  stakingDataKeys,
} from "@/helpers/collateralsApy/getMagicGlpApy/constants";
import type{ ContractInfo } from "@/types/global";
import type { PublicClient } from "viem";

export const getStakingData = async (
  address: string,
  chainId: number,
  contracts: Record<string, ContractInfo>,
  publicClient: PublicClient
) => {
  const trackers = rewardTrackers[chainId as keyof typeof rewardTrackers];

  const stakingInfo: any = await publicClient.readContract({
    ...contracts.rewardReader,
    functionName: 'getStakingInfo',
    args: [address, trackers],
  });

  const data: any = {};
  const propsLength = 5;

  for (let i = 0; i < stakingDataKeys.length; i++) {
    data[stakingDataKeys[i]] = {
      claimable: stakingInfo[i * propsLength],
      tokensPerInterval: stakingInfo[i * propsLength + 1],
      averageStakedAmounts: stakingInfo[i * propsLength + 2],
      cumulativeRewards: stakingInfo[i * propsLength + 3],
      totalSupply: stakingInfo[i * propsLength + 4],
    };
  }

  return data;
};
