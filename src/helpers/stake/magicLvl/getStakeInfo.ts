import { getAccountHelper } from "@/helpers/walletClienHelper";
import { magicLvlConfig } from "@/configs/stake/magicLvlConfig";
import { getPublicClient } from "@/helpers/chains/getChainsInfo";
import type { MagicLvlTokensInfo } from "@/types/magicLvl/stakeInfo";
// import type { MagicLvlStakeInfo } from "@/types/magicLvl/stakeInfo";
import type { MagicLvlTranchesInfo } from "@/types/magicLvl/stakeInfo";
import { getTokensInfo } from "@/helpers/stake/magicLvl/getTokensInfo";
import { getEmptyState } from "@/helpers/stake/magicLvl/getEmptyState";
import { getAdditionalInfo } from "@/helpers/stake/magicLvl/getAdditionalInfo";

// : Promise<MagicLvlStakeInfo>
export const getStakeInfo = async () => {
  const { address } = await getAccountHelper();

  if (!address) {
    return await Promise.all(
      Object.keys(magicLvlConfig).map(async (chainId: string) => {
        const config: any =
          magicLvlConfig[Number(chainId) as keyof typeof magicLvlConfig];

        return await getEmptyState(config, Number(chainId));
      })
    );
  }

  return await Promise.all(
    Object.keys(magicLvlConfig).map(async (chainId: string) => {
      const config: any =
        magicLvlConfig[+chainId as keyof typeof magicLvlConfig];

      const publicClient = getPublicClient(+chainId);

      const { master, harvestor, tokensConfig } = config;

      const tokensInfo = await Promise.all(
        tokensConfig.map(async (config: any) => {
          return await getTokensInfo(
            master,
            harvestor,
            config,
            address,
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
