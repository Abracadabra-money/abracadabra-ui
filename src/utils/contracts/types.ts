import type { Address } from "@wagmi/core";

export type ExtendedContractInfo = {
  chainId: number;
  name: string;
  contractChain: string;
  address: Address;
  abi: any;
};
