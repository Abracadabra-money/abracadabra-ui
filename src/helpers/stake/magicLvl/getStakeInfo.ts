import { getAccount } from "@wagmi/core";
import { magicLvlConfig } from "@/utils/stake/magicLvlConfig";
// import type { MagicLvlStakeInfo } from "@/types/magicLvl/stakeInfo";
import type { MagicLvlTokensInfo } from "@/types/magicLvl/stakeInfo";
import type { MagicLvlTranchesInfo } from "@/types/magicLvl/stakeInfo";
import { getTokensInfo } from "@/helpers/stake/magicLvl/getTokensInfo";
import { getEmptyState } from "@/helpers/stake/magicLvl/getEmptyState";
import { getAdditionalInfo } from "@/helpers/stake/magicLvl/getAdditionalInfo";
import { chainsList } from "@/helpers/chains";
import { createPublicClient, http } from "viem";

// : Promise<MagicLvlStakeInfo>
export const getStakeInfo = async () => {
  const account = getAccount().address;

  if (!account) {
    return await Promise.all(
      Object.keys(magicLvlConfig).map(async (chainId: string) => {
        const config: any =
          magicLvlConfig[Number(chainId) as keyof typeof magicLvlConfig];

        return await getEmptyState(config, Number(chainId));
      })
    );
  }

  return await Promise.all(
    Object.keys(magicLvlConfig).map(async (chainId: any) => {
      const config: any =
        magicLvlConfig[chainId as keyof typeof magicLvlConfig];

      const chain: any = chainsList[chainId as keyof typeof chainsList];

      const publicClient = createPublicClient({
        batch: {
          multicall: true,
        },
        chain: chain,
        transport: http(),
      });

      const { master, harvestor, tokensConfig } = config;

      const tokensInfo = await Promise.all(
        tokensConfig.map(async (config: any) => {
          return await getTokensInfo(
            master,
            harvestor,
            config,
            account,
            publicClient
          );
        })
      );

      const stakeInfo: MagicLvlTranchesInfo = {};
      tokensInfo.map((tranche: MagicLvlTokensInfo) => {
        stakeInfo[tranche.name as keyof typeof stakeInfo] = tranche;
      });

      const additionalInfo = await getAdditionalInfo(stakeInfo);

      return { chainId, ...stakeInfo, ...additionalInfo };
    })
  );
};
