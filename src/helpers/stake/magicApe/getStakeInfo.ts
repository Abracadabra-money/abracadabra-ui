import { getAccount } from "@wagmi/core";
import { chainsList } from "@/helpers/chains";
import { createPublicClient, http } from "viem";
import { magicApeConfig } from "@/utils/stake/magicApeConfig";
import { getTokensInfo } from "@/helpers/stake/magicApe/getTokensInfo";
import { getAdditionalInfo } from "@/helpers/stake/magicApe/getAdditionalInfo";

export const getStakeInfo = async () => {
  const account: any = getAccount().address;

  return await Promise.all(
    Object.keys(magicApeConfig).map(async (chainId: any) => {
      const config: any =
        magicApeConfig[chainId as keyof typeof magicApeConfig];

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
