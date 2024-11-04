import type { Address } from "viem";
import type { createPublicClient } from "viem";

export type ContractInfo = {
  address: Address;
  abi: any;
};

export type PublicClient = ReturnType<typeof createPublicClient>;

export type RouterLinkParams = {
  name: string;
  params?: {
    chainId?: number;
    cauldronId?: number;
  };
};