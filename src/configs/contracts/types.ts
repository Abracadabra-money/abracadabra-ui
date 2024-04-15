import type { Address } from "viem";

export type ExtendedContractInfo = {
  chainId: number;
  name: string;
  contractChain: string;
  address: Address;
  abi: any;
};
