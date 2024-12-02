import type { Address } from "viem";
import type { PoolConfig } from "@/configs/pools/types";
import { getAllPoolsByChain } from "@/helpers/pools/swap/magicLp";

export const getPoolsList = async (
  account: Address,
  poolsConfig: PoolConfig[]
) => {
  const availableChains = Array.from(
    new Set(poolsConfig.map((pool: any) => pool.chainId)).values()
  );

  const poolsList = await Promise.all(
    availableChains.map(async (chainId) =>
      getAllPoolsByChain(chainId, poolsConfig, account)
        .then((results) => {
          // Filter out only the successful results
          const successfulResults = results.filter(
            (result: any) => result instanceof Error === false
          );
          return successfulResults;
        })
        .catch((error) => {
          console.log("something went wrong", error);
          return [];
        })
    )
  );

  return poolsList.flat();
};
