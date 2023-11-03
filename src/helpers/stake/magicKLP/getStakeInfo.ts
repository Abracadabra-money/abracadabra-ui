import { getAccount } from "@wagmi/core";
import { magicKlpConfig } from "@/utils/stake/magicKlpConfig";
import { getEmptyState } from "@/helpers/stake/magicKLP/getEmptyState";
import { getTokensInfo } from "@/helpers/stake/magicKLP/getTokensInfo";
import type { StakeInfo, EmptyState } from "@/types/magicKlp/stakeInfo";

export const getStakeInfo = async (
  chainId: number
): Promise<StakeInfo | EmptyState> => {
  const account = getAccount().address;
  const config = magicKlpConfig[chainId as keyof typeof magicKlpConfig];

  if (!config || !account) return await getEmptyState(config);
  const { mainToken, stakeToken } = await getTokensInfo(account, config);

  return {
    mainToken,
    stakeToken,
  };
};
