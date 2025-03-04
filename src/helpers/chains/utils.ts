import { MAINNET_CHAIN_ID } from "@/constants/global";
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
