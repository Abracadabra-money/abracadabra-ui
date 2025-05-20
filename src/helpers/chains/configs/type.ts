import type { Address } from "viem";

export interface ChainConfig {
  publicClient: any;
  viemConfig: any;
  chainId: number;
  chainName: string;
  symbol: string;
  icon: string;
  baseTokenIcon: string;
  baseTokenSymbol: string;
  wrappedNativeTokenAddress?: Address;
  networkIcon: string;
  lzChainId?: number;
}
