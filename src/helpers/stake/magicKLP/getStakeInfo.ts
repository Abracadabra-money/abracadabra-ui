import type { Address } from "viem";
import { magicKlpConfig } from "@/configs/stake/magicKlpConfig";
import { getPublicClient } from "@/helpers/chains/getChainsInfo";
import type { ChainConfig } from "@/configs/stake/magicKlpConfig";
import { getEmptyState } from "@/helpers/stake/magicKLP/getEmptyState";
import { getTokensInfo } from "@/helpers/stake/magicKLP/getTokensInfo";
import type { MagicKlpStakeInfo } from "@/helpers/stake/magicKLP/types";

export const getStakeInfo = async (
  address: Address
): Promise<MagicKlpStakeInfo[]> => {
  if (!address) {
    return await Promise.all(
      Object.keys(magicKlpConfig).map(async (chainId: string) => {
        const config: ChainConfig =
          magicKlpConfig[Number(chainId) as keyof typeof magicKlpConfig];

        return await getEmptyState(config, Number(chainId));
      })
    );
  }

  return await Promise.all(
    Object.keys(magicKlpConfig).map(async (chainId: string) => {
      const config: ChainConfig =
        magicKlpConfig[+chainId as keyof typeof magicKlpConfig];

      const publicClient = getPublicClient(+chainId);

      const { mainToken, stakeToken } = await getTokensInfo(
        address,
        config,
        publicClient
      );

      return {
        chainId: Number(chainId),
        mainToken,
        stakeToken,
      };
    })
  );
};
