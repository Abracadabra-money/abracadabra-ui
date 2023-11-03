import type { Chain } from "viem";

export type ChainsConfigs = {
  chains: Chain[];
  rpcUrls: string[] | null;
};

export type LocalForkData = {
  forkChainId: number;
  rpcUrl: string;
  forkId: String;
  timestamp: String;
  useFork: Boolean;
};

export type TopUpCauldron = {
  status: string;
  txHash: string | null;
  msg: string;
};

export type MimConfig = {
  name: string;
  chainId: number;
  decimals: number;
  address: string;
  abi: any;
};
export type getMimContract = {
  name: string;
  chainId: number;
  decimals: number;
  address: string;
  abi: any;
};

export type FetchForkInfo = {
  accounts: any;
  block_number: string;
  config: any;
  details: any;
  id: string;
  json_rpc_url: string;
  network_id: string;
};
