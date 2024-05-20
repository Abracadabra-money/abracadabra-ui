import type { Address } from "viem";
import { magicApeConfig } from "@/configs/stake/magicApeConfig";
import { getPublicClient } from "@/helpers/chains/getChainsInfo";
import type { MagicApeConfig } from "@/configs/stake/magicApeConfig";
import { getTokensInfo } from "@/helpers/stake/magicApe/getTokensInfo";
import type { MagicGlpStakeInfo } from "@/helpers/stake/magicApe/types";
import { getAdditionalInfo } from "@/helpers/stake/magicApe/getAdditionalInfo";

export const getStakeInfo = async (
  address: Address
): Promise<MagicGlpStakeInfo[]> => {
  return await Promise.all(
    Object.keys(magicApeConfig).map(async (chainId: string) => {
      const config: MagicApeConfig =
        magicApeConfig[Number(chainId) as keyof typeof magicApeConfig];

      const publicClient = getPublicClient(Number(chainId));

      const { mainToken, stakeToken } = await getTokensInfo(
        address,
        config,
        publicClient
      );

      const additionalInfo = await getAdditionalInfo(config, publicClient);

      return {
        chainId: Number(chainId),
        mainToken,
        stakeToken,
        feePercent: additionalInfo.feePercent,
        leverageInfo: additionalInfo.leverageInfo,
        rewardToken: additionalInfo.rewardToken,
      };
    })
  );
};
