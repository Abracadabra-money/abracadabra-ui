import { getAccount } from "@wagmi/core";
import { magicApeConfig } from "@/configs/stake/magicApeConfig";
import { getPublicClient } from "@/helpers/chains/getChainsInfo";
import { getTokensInfo } from "@/helpers/stake/magicApe/getTokensInfo";
import { getAdditionalInfo } from "@/helpers/stake/magicApe/getAdditionalInfo";

export const getStakeInfo = async () => {
  const account: any = getAccount().address;

  return await Promise.all(
    Object.keys(magicApeConfig).map(async (chainId: string) => {
      const config: any =
        magicApeConfig[Number(chainId) as keyof typeof magicApeConfig];

      const publicClient = getPublicClient(Number(chainId));

      const { mainToken, stakeToken } = await getTokensInfo(
        account,
        config,
        publicClient
      );

      const additionalInfo = await getAdditionalInfo(config, publicClient);

      return {
        chainId,
        mainToken,
        stakeToken,
        ...additionalInfo,
      };
    })
  );
};
