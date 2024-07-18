import localTokenConfigs from "@/configs/pools/poolCreation/tokens/local";
import type { PoolCreationTokenInfo } from "@/configs/pools/poolCreation/types";
import type { Address } from "viem";
import { getPoolCreationTokenInfo } from "./getPoolCreationTokenInfo";
import { getCoinsPrices } from "@/helpers/prices/defiLlama";
import store from "@/store";


const availableChains = Array.from(
  new Set(localTokenConfigs.map((token) => token.chainId)).values()
);

export const getTokenList = async (chainId?: number, account?: Address) => {
  let tokenList: PoolCreationTokenInfo[] = [];

  if (!chainId) {
    tokenList = (await Promise.all(
      availableChains.map(async (chainId) =>
        getAllTokensByChain(chainId, account)
          .then((results) => {
            const successfulResults = results.filter(
              (result) => result instanceof Error === false
            );
            return successfulResults;
          })
          .catch((error) => {
            console.log("something went wrong", error)
            return [] as PoolCreationTokenInfo[];
          })
      )
    )).flat()
  } else {
    tokenList = await getAllTokensByChain(chainId, account)
      .then((results) => {
        const successfulResults = results.filter(
          (result) => result instanceof Error === false
        );
        return successfulResults;
      })
      .catch((error) => {
        console.log("something went wrong", error)
        return [] as PoolCreationTokenInfo[];
      })
  }

  return tokenList
}

export const getAllTokensByChain = async (chainId: number, account?: Address): Promise<PoolCreationTokenInfo[]> => {

  const customTokenConfigs = store.getters.getPoolCreationCustomTokens.data;

  const generalTokenConfigs = [...localTokenConfigs, ...customTokenConfigs]

  const tokenAddresses: Address[] = [];
  const tokenConfigsOnChain = generalTokenConfigs.filter((config) => {
    if (config.chainId === chainId) {
      tokenAddresses.push(config.address)
      return config
    }
  });

  const tokenPrices = await getCoinsPrices(chainId, tokenAddresses)

  const tokensByChain = await Promise.all(
    tokenConfigsOnChain.map(async (config) => {
      const price = tokenPrices.find(tokenPrice => config.address == tokenPrice.address)?.price || 0
      return getPoolCreationTokenInfo({ tokenConfig: config, price, account });
    })
  );

  return tokensByChain;
}
