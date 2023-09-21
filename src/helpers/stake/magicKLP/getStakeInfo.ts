import { getAccount } from "@wagmi/core";
import { getTokensInfo } from "./getTokensInfo";
import { magicKlpConfig } from "@/utils/stake/magicKlpConfig";

export const getStakeInfo = async (chainId: number) => {
  const account = getAccount().address;
  const config = magicKlpConfig[chainId as keyof typeof magicKlpConfig];

  if (!config || !account) return null; // todo emptyState;
  const { mainToken, stakeToken } = await getTokensInfo(account, config);

  return {
    mainToken,
    stakeToken,
  };
};
