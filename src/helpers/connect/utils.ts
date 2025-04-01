// @ts-ignore
import store from "@/store";
import { providers } from "ethers";
import type { Address } from "viem";
import type { Config } from "@wagmi/core";
// @ts-ignore
import { sanctionAbi } from "@/abis/sanctionAbi";
import { walletConnect } from "@wagmi/connectors";
import { rpcList } from "@/helpers/chains/rpcList";
import { MAINNET_CHAIN_ID } from "@/constants/global";
import { filterRpcUrls } from "@/helpers/chains/utils";
import { fallback, getEnsName, http } from "@wagmi/core";
import { getAccountHelper } from "@/helpers/walletClienHelper";
import notification from "@/helpers/notification/notification";
import { DEFAULT_MAINNET_RPC } from "@/helpers/chains/rpcList";
import { SANCTIONS_LIST_ADDRESS } from "@/constants/tokensAddress";
import { getViemConfigById } from "@/helpers/chains/getChainsInfo";
import { initPublicClient } from "@/helpers/chains/initPublicClient";

export const createConnectTransport = () => {
  return Object.fromEntries(
    Object.entries(rpcList).map(([chainId, urls]) => {
      const filteredUrls = filterRpcUrls(urls);
      return [
        chainId,
        fallback(
          filteredUrls.map((url) => http(url)),
          {
            rank: false,
            retryCount: 0,
            retryDelay: 1000000,
          }
        ),
      ];
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
  const mainnet = getViemConfigById(MAINNET_CHAIN_ID);
  const publicClient = initPublicClient(mainnet);

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
  if (!address) return null;

  try {
    return await getEnsName(wagmiConfig, {
      address: address,
      chainId: MAINNET_CHAIN_ID,
    });
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

export const openConnectPopup = () => {
  const account = getAccountHelper();
  if (account.isConnected) return;
  store.commit("setPopupState", { type: "connect", isShow: true });
};
