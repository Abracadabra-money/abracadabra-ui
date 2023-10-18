import { chainsList } from "@/helpers/chains";
import { createPublicClient, http, type PublicClient } from "viem";

export const getPublicClient = (chainId: number): PublicClient => {
  return createPublicClient({
    chain: chainsList[chainId as keyof typeof chainsList],
    transport: http(),
  });
};
