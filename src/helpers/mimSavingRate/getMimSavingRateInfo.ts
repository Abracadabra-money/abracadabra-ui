import type { Address } from "viem";
import type { PublicClient } from "@/types/global";
import { ARBITRUM_CHAIN_ID } from "@/constants/global";
import { getUserInfo } from "@/helpers/mimSavingRate/getUserInfo";
import { mimSavingRateConfig } from "@/configs/stake/mimSavingRateConfig";
import type { MimSavingRateConfig } from "@/configs/stake/mimSavingRateConfig";
import { getLockingMultiRewardsInfo } from "@/helpers/mimSavingRate/getLockingMultiRewardsInfo";

export const getMimSavingRateInfo = async (
  account: Address,
  publicClient: PublicClient,
  chainId = ARBITRUM_CHAIN_ID
) => {
  const config: MimSavingRateConfig | undefined = mimSavingRateConfig.find(
    (config: MimSavingRateConfig) => config.chainId === chainId
  );

  if (!config) return null;

  const lockingMultiRewardsInfo = await getLockingMultiRewardsInfo(
    publicClient,
    config.lockingMultiRewardsContract,
    config.rewardToken.contract.address
  );

  const userInfo = await getUserInfo(
    publicClient,
    account,
    config.lockingMultiRewardsContract,
    config.rewardToken.contract.address,
    config.stakingToken.contract
  );

  return {
    ...config,
    ...lockingMultiRewardsInfo,
    userInfo,
  };
};
