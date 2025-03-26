import type { Chain } from "viem";
import { MAINNET_CHAIN_ID } from "@/constants/global";
import { chainsConfigs } from "@/helpers/chains/configs";
import { badRequestListRpc, rpcList } from "@/helpers/chains/rpcList";

export const filterRpcUrls = (rpcUrls: string[]) => {
  const uniqueRpcUrls = new Set(rpcUrls);
  return Array.from(uniqueRpcUrls).filter(
    (rpc) => !badRequestListRpc.includes(rpc)
  );
};

export const getRpcListByChainId = (chainId: number) => {
  if (!rpcList[chainId]) return filterRpcUrls(rpcList[MAINNET_CHAIN_ID]);
  return filterRpcUrls(rpcList[chainId]);
};

export const getConnectChains = (): [Chain, ...Chain[]] => {
  const chains = chainsConfigs.map((chain) => chain.viemConfig);
  return [chains[0], ...chains.slice(1)] as [Chain, ...Chain[]];
};

export const getRpcByChainId = (chainId: number): string => {
  const chain = chainsConfigs.find((chain) => chain.chainId === chainId);
  if (chain) return chain.viemConfig.rpcUrls.default.http[0];

  return rpcList[MAINNET_CHAIN_ID][0];
};

export const getAvailableChainList = () => {
  return chainsConfigs.map((chain) => chain.chainId);
};
