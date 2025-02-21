// @ts-ignore
import store from "@/store";
import { providers } from "ethers";
import type { Address } from "viem";
import type { Config } from "@wagmi/core";
// @ts-ignore
import { sanctionAbi } from "@/abis/sanctionAbi";
import { walletConnect } from "@wagmi/connectors";
import { MAINNET_CHAIN_ID } from "@/constants/global";
import { fallback, getEnsName, http } from "@wagmi/core";
import notification from "@/helpers/notification/notification";
import { DEFAULT_MAINNET_RPC } from "@/helpers/connect/rpsList";
import { SANCTIONS_LIST_ADDRESS } from "@/constants/tokensAddress";
import { initPublicClient } from "@/helpers/connect/initPublicClient";
import { badRequestListRpc, rpsList } from "@/helpers/connect/rpsList";

export const filterRpcUrls = (rpcUrls: string[]) => {
  const uniqueRpcUrls = new Set(rpcUrls);
  return Array.from(uniqueRpcUrls).filter(
    (rpc) => !badRequestListRpc.includes(rpc)
  );
};

export const createConnectTransport = () => {
  return Object.fromEntries(
    Object.entries(rpsList).map(([chainId, urls]) => {
      const filteredUrls = filterRpcUrls(urls);
      return [chainId, fallback(filteredUrls.map((url) => http(url)))];
    })
  );
};

export const createConnectors = () => {
  return [
    walletConnect({
      projectId: import.meta.env.VITE_APP_CONNECT_KEY,
    }),
  ];
};

export const checkSanctionAddress = async (address: Address) => {
  const publicClient = initPublicClient(MAINNET_CHAIN_ID);

  const isSanctioned = await publicClient.readContract({
    address: SANCTIONS_LIST_ADDRESS,
    abi: sanctionAbi,
    functionName: "isSanctioned",
    args: [address],
  });

  if (!isSanctioned) return isSanctioned;
  else await store.dispatch("notifications/new", notification.sanctionAddress);
};

export const getUserEnsName = async (wagmiConfig: Config, address: Address) => {
  try {
    return await getEnsName(wagmiConfig, { address: address! });
  } catch (error) {
    return await new providers.StaticJsonRpcProvider(
      DEFAULT_MAINNET_RPC
    ).lookupAddress(address);
  }
};

export const commitWalletData = async (
  chainId: number,
  provider: providers.StaticJsonRpcProvider,
  address: Address | null,
  ensName: string | null,
  setWalletConnection: boolean,
  wagmiConfig: Config
) => {
  store.commit("setChainId", chainId);
  store.commit("setProvider", provider);
  store.commit("setAccount", address);
  store.commit("setENSName", ensName);
  store.commit("setWalletConnection", setWalletConnection);
  store.commit("setWagmiConfig", wagmiConfig);
};
