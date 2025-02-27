import type { PublicClient } from "viem";

export interface ChainConfig {
  publicClient: PublicClient;
  viemConfig: any;
  chainId: number;
  chainName: string;
  symbol: string;
  icon: string;
  baseTokenIcon: string;
  baseTokenSymbol: string;
  networkIcon: string;
  lzChainId?: number;
}
