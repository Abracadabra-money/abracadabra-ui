import type { Chain } from "viem";

export type ChainsConfigs = {
  chains: Chain[];
  rpcUrls: String[] | null;
};

export type LocalForkData = {
  forkChainId: Number;
  forkId: String;
  timestamp: String;
  useFork: Boolean;
};
