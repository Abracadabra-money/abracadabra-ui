import { utils } from "ethers";
import { defaultRpc } from "@/helpers/chains";
import cauldronsConfig from "@/configs/cauldrons";
import { getMainParams } from "@/helpers/cauldron/getMainParams";
import type { CauldronConfig } from "@/configs/cauldrons/configTypes";
import { getUserPositions } from "@/helpers/cauldron/getUserPositions";

type CauldronListItem = {
  apr: object;
  config: object;
  mainParams: object;
  userPosition: object;
  additionalInfo: object;
};

const filteredByChainId = (chainId: number) => {
  return cauldronsConfig.filter((config) => config.chainId === chainId);
};

const filteredByPrivate = (configs: any, account: string) => {
  return configs.filter((config: any) => {
    if (config.cauldronSettings.isPrivate)
      return config.cauldronSettings.privatelyFor!.some(
        (walletAddress: string) => walletAddress === account
      );

    return config;
  });
};

export const getMarketList = async (
  account: string,
  chains = null
): Promise<CauldronListItem[]> => {
  const curentChains = chains ? chains : Object.keys(defaultRpc);

  const cauldronsInfo: CauldronListItem[] = [];

  await Promise.all(
    curentChains.map(async (chainId: string) => {
      const configsByChain = filteredByChainId(Number(chainId));

      const filteredConfigs: CauldronConfig[] = filteredByPrivate(
        configsByChain,
        account
      );

      if (filteredConfigs.length === 0) return [];

      const mainParams = await getMainParams(filteredConfigs, Number(chainId));

      const userPositions = await getUserPositions(
        filteredConfigs,
        account,
        Number(chainId)
      );

      filteredConfigs.forEach((config, idx) => {
        cauldronsInfo.push({
          apr: {
            value: 0,
            multiplier: 0,
          },
          config,
          mainParams: mainParams[idx],
          userPosition: userPositions[idx],
          additionalInfo: {
            tokensRate: utils.parseUnits("1", config.collateralInfo.decimals),
          },
        });
      });
    })
  );

  return cauldronsInfo;
};
