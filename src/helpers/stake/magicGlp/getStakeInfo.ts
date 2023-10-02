import { getAccount } from "@wagmi/core";
import { getTokensInfo } from "./getTokensInfo";
import { magicGlpConfig } from "@/utils/stake/magicGlpConfig";
import { emptyState } from "@/helpers/stake/magicGlp/emptyState";
import type { EmptyState } from "@/types/magicGlp/additionalInfo";
import type { ChainConfig, StakeInfo } from "@/types/magicGlp/configsInfo";
import { getAdditionalInfo } from "@/helpers/stake/magicGlp/getAdditionalInfo";

export const getStakeInfo = async (
  chainId: number
): Promise<StakeInfo | EmptyState> => {
  const account = getAccount().address;
  const config: ChainConfig =
    magicGlpConfig[chainId as keyof typeof magicGlpConfig];
  if (!config || !account) return emptyState;

  const { mainToken, stakeToken } = await getTokensInfo(account, config);
  const additionalInfo = await getAdditionalInfo(config, chainId);

  return {
    mainToken,
    stakeToken,
    ...additionalInfo,
  };
};
