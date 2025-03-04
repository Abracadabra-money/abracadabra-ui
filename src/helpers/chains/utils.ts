import { MAINNET_CHAIN_ID } from "@/constants/global";
import { badRequestListRpc, rpsList } from "./rpsList";

export const filterRpcUrls = (rpcUrls: string[]) => {
  const uniqueRpcUrls = new Set(rpcUrls);
  return Array.from(uniqueRpcUrls).filter(
    (rpc) => !badRequestListRpc.includes(rpc)
  );
};

export const getRpcListByChainId = (chainId: number) => {
  if (!rpsList[chainId]) return filterRpcUrls(rpsList[MAINNET_CHAIN_ID]);
  return filterRpcUrls(rpsList[chainId]);
};
