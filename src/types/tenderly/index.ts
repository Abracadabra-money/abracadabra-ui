import type { Chain } from "viem";

export type ChainsConfigs = {
  chains: Chain[];
  rpcUrls: String[] | null;
};

export type LocalForkData = {
  forkChainId: number;
  forkId: String;
  timestamp: String;
  useFork: Boolean;
};

export type AddAndSwitchForkOnWallet = {
  success?: boolean;
  error?: any;
};
