import type { Address } from "viem";
import type { PublicClient } from "@/types/global";
import { ARBITRUM_CHAIN_ID } from "@/constants/global";
import { getUserInfo, type UserInfo } from "@/helpers/mimSavingRate/getUserInfo";
import {
  type MimSavingRateConfig,
  mimSavingRateConfig,
} from "@/configs/stake/mimSavingRateConfig";
import { getLockingMultiRewardsInfo, type LockingMultiRewardsInfo } from "@/helpers/mimSavingRate/getLockingMultiRewardsInfo";

export type MimSavingRateInfo = {
  baseApr: number;
  userInfo: UserInfo;
} & LockingMultiRewardsInfo & MimSavingRateConfig;

export const getMimSavingRateInfo = async (
  account: Address,
  publicClient: PublicClient,
  chainId = ARBITRUM_CHAIN_ID
): Promise<MimSavingRateInfo | null> => {
  const config: MimSavingRateConfig | undefined = mimSavingRateConfig.find(
    (config: MimSavingRateConfig) => config.chainId === chainId
  );

  if (!config) return null;

  const lockingMultiRewardsInfo = await getLockingMultiRewardsInfo(
    publicClient,
    config.lockingMultiRewardsContract,
    config.rewardTokens
  );

  const userInfo = await getUserInfo(
    publicClient,
    account,
    config.lockingMultiRewardsContract,
    config.rewardTokens,
    config.stakingToken.contract
  );

  return {
    ...config,
    ...lockingMultiRewardsInfo,
    baseApr: 50,
    userInfo,
  };
};