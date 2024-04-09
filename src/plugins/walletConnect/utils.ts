import store from "@/store";
import { markRaw } from "vue";
import { providers } from "ethers";
import type { Address } from "viem";
import { RPC_ETH } from "@/constants/rpc";
import type { Config } from "@wagmi/core";
import { defaultRpc } from "@/helpers/chains";
import { sanctionAbi } from "@/abis/sanctionAbi";
import { getWalletClient, getEnsName } from "@wagmi/core";
import { defaultWagmiConfig } from "@web3modal/wagmi/vue";
import { getChainsConfigs } from "@/helpers/getChainsConfigs";
import notification from "@/helpers/notification/notification";
import { getPublicClient } from "@/helpers/chains/getChainsInfo";
import { SANCTIONS_LIST_ADDRESS } from "@/constants/tokensAddress";

export const createWagmiConfig = (projectId: string): Config => {
  // 1. Define constants
  const { chains } = getChainsConfigs();

  // 2. Create wagmiConfig
  const metadata = {
    name: "Web3Modal",
    description: "Web3Modal Example",
    url: "https://app.abracadabra.money/#/", // origin your domain & subdomain
    icons: ["https://avatars.githubusercontent.com/u/37784886"],
  };

  return defaultWagmiConfig({
    chains,
    projectId,
    metadata,
    // ...wagmiOptions // Optional - Override createConfig parameters
  });
};

export const checkUnSupportedChain = (chainId = 1) => {
  const unsupportedChain = !defaultRpc[chainId as keyof typeof defaultRpc];

  if (unsupportedChain) {
    localStorage.setItem("MAGIC_MONEY_CHAIN_ID", chainId.toString());
  }

  return { unsupportedChain };
};

export const checkSanctionAddress = async (address: Address) => {
  const publicClient = getPublicClient(1);

  const isSanctioned = await publicClient.readContract({
    address: SANCTIONS_LIST_ADDRESS,
    abi: sanctionAbi,
    functionName: "isSanctioned",
    args: [address],
  });

  if (isSanctioned) {
    await store.dispatch("notifications/new", notification.sanctionAddress);
  }

  return isSanctioned;
};

export const getJsonRpcSigner = async (
  unsupportedChain: boolean,
  staticJsonRpcProvider: providers.StaticJsonRpcProvider,
  wagmiConfig: Config
) => {
  if (unsupportedChain) return staticJsonRpcProvider;

  const walletClient = await getWalletClient(wagmiConfig);

  if (!walletClient) return undefined;

  const { account, chain, transport } = walletClient;

  const network = {
    chainId: chain?.id || 1,
    name: chain?.name ?? "Ethereum",
    ensAddress: chain?.contracts?.ensRegistry?.address ?? "",
  };

  const provider = new providers.Web3Provider(transport, network);
  return markRaw(provider.getSigner(account?.address ?? ""));
};

export const commitWalletData = async (
  chainId: number,
  provider: providers.StaticJsonRpcProvider,
  signer: providers.JsonRpcSigner | providers.StaticJsonRpcProvider,
  address: Address | null,
  ensName: string | null,
  setWalletConnection: boolean,
  wagmiConfig: Config
) => {
  store.commit("setChainId", chainId);
  store.commit("setProvider", provider);
  store.commit("setSigner", signer);
  store.commit("setAccount", address);
  store.commit("setENSName", ensName);
  store.commit("setWalletConnection", setWalletConnection);
  store.commit("setWagmiConfig", wagmiConfig);
};

export const getUserEnsName = async (wagmiConfig: Config, address: Address) => {
  try {
    return await getEnsName(wagmiConfig, {
      address: address!,
    });
  } catch (error) {
    return await new providers.StaticJsonRpcProvider(RPC_ETH).lookupAddress(
      address
    );
  }
};
