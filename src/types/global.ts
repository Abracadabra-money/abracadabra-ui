import type { Address } from "@wagmi/core";
import type { createPublicClient } from "viem";

export type ContractInfo = {
  address: Address;
  abi: any;
};

export type PublicClient = ReturnType<typeof createPublicClient>;
