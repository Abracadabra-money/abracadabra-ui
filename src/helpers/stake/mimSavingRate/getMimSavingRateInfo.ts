import type { Address } from "viem";
import { ARBITRUM_CHAIN_ID } from "@/constants/global";
import { getPublicClient } from "@/helpers/getPublicClient";
import { getUserInfo } from "@/helpers/stake/mimSavingRate/getUserInfo";
import { mimSavingRateConfig } from "@/configs/stake/mimSavingRateConfig";
import type { MimSavingRateConfig } from "@/configs/stake/mimSavingRateConfig";
import { getLockingMultiRewardsInfo } from "@/helpers/stake/mimSavingRate/getLockingMultiRewardsInfo";

export const getMimSavingRateInfo = async (
  account: Address,
  chainId = ARBITRUM_CHAIN_ID
) => {
  const config: MimSavingRateConfig | undefined = mimSavingRateConfig.find(
    (config: MimSavingRateConfig) => config.chainId === chainId
  );

  // todo accepted chains?
  if (!config) return null; //todo: return empty state

  const publicClient = getPublicClient(config.chainId);

  const lockingMultiRewardsInfo = await getLockingMultiRewardsInfo(
    publicClient,
    config.lockingMultiRewards,
    config.rewardToken.contract.address
  );

  const userInfo = await getUserInfo(
    publicClient,
    account,
    config.lockingMultiRewards,
    config.rewardToken.contract.address
  );

  return {
    ...lockingMultiRewardsInfo,
    userInfo,
  };
};
