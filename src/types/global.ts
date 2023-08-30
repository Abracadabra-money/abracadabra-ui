import type { Address } from "@wagmi/core";
import type { Abi } from "viem";

export type ContractInfo = {
  address: Address;
  abi: Abi;
};
