import { getAccount } from "@wagmi/core";
import { getTokensInfo } from "./getTokensInfo";
import { magicKlpConfig } from "@/utils/stake/magicKlpConfig";
import { emptyState } from "@/helpers/stake/magicKLP/emptyState";
import type { StakeInfo, EmptyState } from "@/types/magicKlp/stakeInfo";

export const getStakeInfo = async (
  chainId: number
): Promise<StakeInfo | EmptyState> => {
  const account = getAccount().address;
  const config = magicKlpConfig[chainId as keyof typeof magicKlpConfig];

  if (!config || !account) return emptyState;
  const { mainToken, stakeToken } = await getTokensInfo(account, config);

  return {
    mainToken,
    stakeToken,
  };
};
