import type { Address } from "viem";
import { getPublicClient } from "@/helpers/chains/getChainsInfo";
import { getTokensInfo } from "@/helpers/stake/magicGlp/getTokensInfo";
import { getEmptyState } from "@/helpers/stake/magicGlp/getEmptyState";
import type { MagicGlpStakeInfo } from "@/helpers/stake/magicGlp/types";
import { magicGlpConfig } from "@/configs/stake/magicGlp/magicGlpConfig";
import { getAdditionalInfo } from "@/helpers/stake/magicGlp/getAdditionalInfo";

export const getStakeInfo = async (
  address: Address
): Promise<MagicGlpStakeInfo[]> => {
  if (!address) {
    return await Promise.all(
      Object.keys(magicGlpConfig).map(async (chainId: string) => {
        const config =
          magicGlpConfig[Number(chainId) as keyof typeof magicGlpConfig];

        return await getEmptyState(config, Number(chainId));
      })
    );
  }

  return await Promise.all(
    Object.keys(magicGlpConfig).map(async (chainId: string) => {
      const config =
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
        chainId: Number(chainId),
        mainToken,
        stakeToken,
        ...additionalInfo,
      };
    })
  );
};
