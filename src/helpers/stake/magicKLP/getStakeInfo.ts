import { getAccount } from "@wagmi/core";
import { chainsList } from "@/helpers/chains";
import { createPublicClient, http } from "viem";
import { magicKlpConfig } from "@/utils/stake/magicKlpConfig";
import { getEmptyState } from "@/helpers/stake/magicKLP/getEmptyState";
import { getTokensInfo } from "@/helpers/stake/magicKLP/getTokensInfo";
import type { StakeInfo, EmptyState } from "@/types/magicKlp/stakeInfo";

export const getStakeInfo = async (): Promise<StakeInfo[] | EmptyState[]> => {
  const account = getAccount().address;

  if (!account) {
    return await Promise.all(
      Object.keys(magicKlpConfig).map(async (chainId: string) => {
        const config: any =
          magicKlpConfig[Number(chainId) as keyof typeof magicKlpConfig];

        return await getEmptyState(config, Number(chainId));
      })
    );
  }

  return await Promise.all(
    Object.keys(magicKlpConfig).map(async (chainId: any) => {
      const config: any =
        magicKlpConfig[chainId as keyof typeof magicKlpConfig];

      const chain: any = chainsList[chainId as keyof typeof chainsList];

      const publicClient = createPublicClient({
        batch: {
          multicall: true,
        },
        chain: chain,
        transport: http(),
      });

      const { mainToken, stakeToken } = await getTokensInfo(
        account,
        config,
        publicClient
      );

      return {
        chainId,
        mainToken,
        stakeToken,
      };
    })
  );
};
