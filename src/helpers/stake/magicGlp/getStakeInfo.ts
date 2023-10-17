import { getAccount } from "@wagmi/core";
import { magicGlpConfig } from "@/utils/stake/magicGlpConfig";
import type { EmptyState } from "@/types/magicGlp/additionalInfo";
import { getTokensInfo } from "@/helpers/stake/magicGlp/getTokensInfo";
import { getEmptyState } from "@/helpers/stake/magicGlp/getEmptyState";
import type { ChainConfig, StakeInfo } from "@/types/magicGlp/configsInfo";
import { getAdditionalInfo } from "@/helpers/stake/magicGlp/getAdditionalInfo";

export const getStakeInfo = async (
  chainId: number
): Promise<StakeInfo | EmptyState> => {
  const account = getAccount().address;
  const config: ChainConfig =
    magicGlpConfig[chainId as keyof typeof magicGlpConfig];
  if (!config || !account) return getEmptyState(config, chainId);

  const { mainToken, stakeToken } = await getTokensInfo(account, config);
  const additionalInfo = await getAdditionalInfo(config, chainId);

  return {
    mainToken,
    stakeToken,
    ...additionalInfo,
  };
};
