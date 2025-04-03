export interface ChainConfig {
  publicClient: any;
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
