import { createPublicClient, http } from "viem";
import type { PublicClient } from "@/types/global";
import { getChainById } from "@/helpers/chains/index";

export const getPublicClient = (chainId: number | string): PublicClient => {
  return createPublicClient({
    chain: getChainById(Number(chainId)),
    transport: http(),
  });
};
