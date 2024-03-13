import { getAllPoolsByChain } from "@/helpers/pools/swap/magicLp";
import type { Address } from "viem";

const availableChains = [168587773];

export const getPoolsList = async (account: Address) => {
  const poolsList = await Promise.all(
    availableChains.map(
      async (chainId) => await getAllPoolsByChain(chainId, account)
    )
  );

  return poolsList.flat();
};
