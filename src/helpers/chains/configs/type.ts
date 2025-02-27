import { initPublicClient } from "@/helpers/connect/initPublicClient";

export interface ChainConfig {
  publicClient: ReturnType<typeof initPublicClient>;
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
