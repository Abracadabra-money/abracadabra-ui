import type {
  MagicLvlStakeInfo,
  MagicLvlTokensInfo,
  MagicLvlTranchesInfo,
} from "@/types/magicLvl/stakeInfo";
import { getAccount } from "@wagmi/core";
import { magicLvlConfig } from "@/utils/stake/magicLvlConfig";
import { getTokensInfo } from "@/helpers/stake/magicLvl/getTokensInfo";
import { getAdditionalInfo } from "@/helpers/stake/magicLvl/getAdditionalInfo";

export const getStakeInfo = async (
  chainId: number
): Promise<MagicLvlStakeInfo> => {
  const account = getAccount().address;
  const config = magicLvlConfig[chainId as keyof typeof magicLvlConfig];

  if (!config || !account) return {};

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
