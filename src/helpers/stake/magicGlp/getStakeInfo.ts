import { getAccount } from "@wagmi/core";
import { chainsList } from "@/helpers/chains";
import { createPublicClient, http } from "viem";
import { magicGlpConfig } from "@/utils/stake/magicGlpConfig";
import type { StakeInfo } from "@/types/magicGlp/configsInfo";
import type { EmptyState } from "@/types/magicGlp/additionalInfo";
import { getTokensInfo } from "@/helpers/stake/magicGlp/getTokensInfo";
import { getEmptyState } from "@/helpers/stake/magicGlp/getEmptyState";
import { getAdditionalInfo } from "@/helpers/stake/magicGlp/getAdditionalInfo";

export const getStakeInfo = async (): Promise<StakeInfo[] | EmptyState[]> => {
  const account: any = getAccount().address;

  if (!account) {
    return await Promise.all(
      Object.keys(magicGlpConfig).map(async (chainId: string) => {
        const config: any =
          magicGlpConfig[Number(chainId) as keyof typeof magicGlpConfig];

        return await getEmptyState(config, Number(chainId));
      })
    );
  }

  return await Promise.all(
    Object.keys(magicGlpConfig).map(async (chainId: any) => {
      const config: any =
        magicGlpConfig[chainId as keyof typeof magicGlpConfig];

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

      const additionalInfo = await getAdditionalInfo(
        config,
        chainId,
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
