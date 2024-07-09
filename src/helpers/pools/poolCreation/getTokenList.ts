import tokenConfigs from "@/configs/pools/poolCreation/tokens";
import type { PoolCreationTokenInfo } from "@/configs/pools/poolCreation/types";
import type { Address } from "viem";
import { getPoolCreationTokenInfo } from "./getPoolCreationTokenInfo";

const availableChains = Array.from(
  new Set(tokenConfigs.map((token) => token.chainId)).values()
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
  const tokensByChain = await Promise.all(
    tokenConfigs
      .filter((config) => config.chainId === chainId)
      .map(async (config) => {
        return getPoolCreationTokenInfo(config, account);
      })
  );

  return tokensByChain;
}
