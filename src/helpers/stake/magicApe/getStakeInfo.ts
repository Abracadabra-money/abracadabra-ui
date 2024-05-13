import { getAccountHelper } from "@/helpers/walletClienHelper";
import { magicApeConfig } from "@/configs/stake/magicApeConfig";
import { getPublicClient } from "@/helpers/chains/getChainsInfo";
import { getTokensInfo } from "@/helpers/stake/magicApe/getTokensInfo";
import { getAdditionalInfo } from "@/helpers/stake/magicApe/getAdditionalInfo";

export const getStakeInfo = async () => {
  const { address } = await getAccountHelper();

  return await Promise.all(
    Object.keys(magicApeConfig).map(async (chainId: string) => {
      const config: any =
        magicApeConfig[Number(chainId) as keyof typeof magicApeConfig];

      const publicClient = getPublicClient(Number(chainId));

      const { mainToken, stakeToken } = await getTokensInfo(
        address,
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
