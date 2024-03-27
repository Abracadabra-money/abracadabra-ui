import { createPublicClient, http } from "viem";
import { chainsList } from "@/helpers/chains/index";

export const getPublicClient = (chainId: number | string) => {
  return createPublicClient({
    chain: chainsList[chainId as keyof typeof chainsList],
    transport: http(),
  });
};
