import poolsConfig from "@/configs/pools/pools";
import { getAllPoolsByChain } from "@/helpers/pools/swap/magicLp";
import type { Address } from "viem";

const availableChains = Array.from(
  new Set(poolsConfig.map((pool) => pool.chainId)).values()
);

export const getPoolsList = async (account: Address) => {
  const poolsList = await Promise.all(
    availableChains.map(async (chainId) =>
      getAllPoolsByChain(chainId, account)
        .then((results) => {
          // Filter out only the successful results
          const successfulResults = results.filter(
            (result: any) => result instanceof Error === false
          );
          return successfulResults;
        })
        .catch((error) => {
          console.log("something went wrong", error)
          return [];
        })
    )
  );

  return poolsList.flat();
};
