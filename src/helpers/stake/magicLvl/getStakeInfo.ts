import { getAccount } from "@wagmi/core";
import { magicLvlConfig } from "@/utils/stake/magicLvlConfig";
import type { MagicLvlStakeInfo } from "@/types/magicLvl/stakeInfo";
import type { MagicLvlTokensInfo } from "@/types/magicLvl/stakeInfo";
import type { MagicLvlTranchesInfo } from "@/types/magicLvl/stakeInfo";
import { getTokensInfo } from "@/helpers/stake/magicLvl/getTokensInfo";
import { getEmptyState } from "@/helpers/stake/magicLvl/getEmptyState";
import { getAdditionalInfo } from "@/helpers/stake/magicLvl/getAdditionalInfo";

//
export const getStakeInfo = async (
  chainId: number
): Promise<MagicLvlStakeInfo> => {
  const account = getAccount().address;
  const config = magicLvlConfig[chainId as keyof typeof magicLvlConfig];

  if (!config || !account) return await getEmptyState(config);

  const { master, harvestor, tokensConfig } = config;

  const tokensInfo = await Promise.all(
    tokensConfig.map(async (config) => {
      return await getTokensInfo(master, harvestor, config, account);
    })
  );

  const stakeInfo: MagicLvlTranchesInfo = {};
  tokensInfo.map((tranche: MagicLvlTokensInfo) => {
    stakeInfo[tranche.name as keyof typeof stakeInfo] = tranche;
  });

  const additionalInfo = await getAdditionalInfo(stakeInfo);

  return { ...stakeInfo, ...additionalInfo };
};
