import type { Address } from "viem";

export type ContractInfo = {
  address: Address;
  abi: any;
};

export type RouterLinkParams = {
  name: string;
  params?: {
    chainId?: number;
    cauldronId?: number;
  };
};
