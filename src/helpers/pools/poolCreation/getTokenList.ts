import tokenConfigs from "@/configs/pools/poolCreation/tokens";
import type { PoolCreationTokenInfo } from "@/configs/pools/poolCreation/types";
import type { Address } from "viem";
import { getPoolCreationTokenInfo } from "./getPoolCreationTokenInfo";

const availableChains = Array.from(
  new Set(tokenConfigs.map((token) => token.chainId)).values()
);

export const getTokenList = async (account?: Address) => {
  const tokenList = await Promise.all(
    availableChains.map(async (chainId) =>
      getAllTokensByChain(chainId, account)
        .then((results) => {
          // Filter out only the successful results
          const successfulResults = results.filter(
            (result) => result instanceof Error === false
          );
          return successfulResults;
        })
        .catch((error) => {
          console.log("something went wrong", error)
          return [];
        })
    )
  )

  return tokenList.flat()
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
