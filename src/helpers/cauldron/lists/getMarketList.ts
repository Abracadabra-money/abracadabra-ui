import { utils } from "ethers";
import type { Address } from "viem";
import cauldronsConfig from "@/configs/cauldrons";
import { getAvailableChainList } from "@/helpers/chains/utils";
import { getMainParams } from "@/helpers/cauldron/getMainParams";
import type { CauldronConfig } from "@/configs/cauldrons/configTypes";
import { getUserPositions } from "@/helpers/cauldron/getUserPositions";
import type { MainParams, UserPositions } from "@/helpers/cauldron/types";

export type CauldronListItem = {
  apr: { value: number; multiplier: number };
  config: CauldronConfig;
  mainParams: MainParams;
  userPosition: UserPositions;
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
  const curentChains = chains ? chains : getAvailableChainList();

  const cauldronsInfo: CauldronListItem[] = [];

  await Promise.all(
    curentChains.map(async (chainId) => {
      const configsByChain = filteredByChainId(Number(chainId));

      const filteredConfigs: CauldronConfig[] = filteredByPrivate(
        configsByChain,
        account
      );

      if (filteredConfigs.length === 0) return [];

      const mainParams = await getMainParams(filteredConfigs, Number(chainId));

      const userPositions = await getUserPositions(
        filteredConfigs,
        account as Address,
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
