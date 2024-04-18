import type { StakeInfo } from "@/types/magicGlp/configsInfo";
import { getAccountHelper } from "@/helpers/walletClienHelper";
import { getPublicClient } from "@/helpers/chains/getChainsInfo";
import type { EmptyState } from "@/types/magicGlp/additionalInfo";
import { getTokensInfo } from "@/helpers/stake/magicGlp/getTokensInfo";
import { getEmptyState } from "@/helpers/stake/magicGlp/getEmptyState";
import { magicGlpConfig } from "@/configs/stake/magicGlp/magicGlpConfig";
import { getAdditionalInfo } from "@/helpers/stake/magicGlp/getAdditionalInfo";

export const getStakeInfo = async (): Promise<StakeInfo[] | EmptyState[]> => {
  const { address } = await getAccountHelper();

  if (!address) {
    return await Promise.all(
      Object.keys(magicGlpConfig).map(async (chainId: string) => {
        const config: any =
          magicGlpConfig[Number(chainId) as keyof typeof magicGlpConfig];

        return await getEmptyState(config, Number(chainId));
      })
    );
  }

  return await Promise.all(
    Object.keys(magicGlpConfig).map(async (chainId: string) => {
      const config: any =
        magicGlpConfig[Number(chainId) as keyof typeof magicGlpConfig];

      const publicClient = getPublicClient(Number(chainId));

      const { mainToken, stakeToken } = await getTokensInfo(
        address,
        config,
        publicClient
      );

      const additionalInfo = await getAdditionalInfo(
        config,
        Number(chainId),
        publicClient
      );

      return {
        chainId,
        mainToken,
        stakeToken,
        ...additionalInfo,
      };
    })
  );
};
