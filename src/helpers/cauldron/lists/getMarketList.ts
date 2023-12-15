import { providers, Contract, utils } from "ethers";
import { defaultRpc } from "@/helpers/chains";
import cauldronsConfig from "@/utils/cauldronsConfig";
import { MulticallWrapper } from "ethers-multicall-provider";
import { getMainParams } from "@/helpers/cauldron/getMainParams";
import { getUserPositions } from "@/helpers/cauldron/getUserPositions";
import type { CauldronConfig } from "@/utils/cauldronsConfig/configTypes";

type CauldronListItem = {
  apr: object;
  config: object;
  mainParams: object;
  userPosition: object;
  additionalInfo: object;
};

const filteredByChainId = (chainId: number) => {
  return cauldronsConfig.filter((config) => config.chainId === +chainId);
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
    curentChains.map(async (chainId: any) => {
      const configsByChain = filteredByChainId(chainId);

      const filteredConfigs: CauldronConfig[] = filteredByPrivate(
        configsByChain,
        account
      );

      if (!filteredConfigs) return [];

      const provider = new providers.StaticJsonRpcProvider(
        defaultRpc[chainId as keyof typeof defaultRpc]
      );

      const multicallProvider = MulticallWrapper.wrap(provider);

      const mainParams = await getMainParams(
        filteredConfigs,
        multicallProvider,
        chainId
      );

      const cauldronContracts = filteredConfigs.map((config: any) => {
        return new Contract(
          config.contract.address,
          config.contract.abi,
          multicallProvider
        );
      });

      const userPositions = await getUserPositions(
        filteredConfigs,
        multicallProvider,
        account,
        cauldronContracts,
        chainId
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
