import { useImage } from "@/helpers/useImage";
import notification from "@/helpers/notification/notification.js";
import store from "@/store";
import { InjectedConnector } from "@wagmi/core";
import { EthereumClient } from "@web3modal/ethereum";
import { configureChains, createConfig } from "@wagmi/core";
import { publicProvider } from "@wagmi/core/providers/public";
import { createWeb3Modal, useWeb3Modal } from "@web3modal/wagmi/vue";
import { walletConnectProvider, EIP6963Connector } from "@web3modal/wagmi";
import { getChainsConfigs } from "@/helpers/getChainsConfigs";
import { WalletConnectConnector } from "@wagmi/core/connectors/walletConnect";
import { CoinbaseWalletConnector } from "@wagmi/core/connectors/coinbaseWallet";
import type { Chain } from "viem";

export const createEthereumClients = () => {
  // 1. Define constants
  const projectId = import.meta.env.VITE_APP_CONNECT_KEY || "";

  const { chains } = getChainsConfigs();

  // 2. Configure wagmi client
  const { publicClient } = createPublicClient(chains, projectId);

  const wagmiConfig = createConfig({
    autoConnect: true,
    connectors: createConnectors(chains, projectId),
    publicClient,
  });

  // 3. Create ethereum and modal clients
  const ethereumClient = new EthereumClient(wagmiConfig, chains);

  if (!projectId) {
    console.log("Web3Modal error: \nYou need to provide projectId env");
    store.dispatch("notifications/new", notification.web3modalProjectId);
    return { ethereumClient };
  }

  createWeb3Modal({
    wagmiConfig,
    projectId,
    themeMode: "dark",
    themeVariables: {
      "--w3m-font-family": "'Prompt', sans-serif",
      "--w3m-accent": "#76c3f5",
      "--w3m-z-index": 1000,
    },
    chainImages: {
      2222: useImage("assets/images/networks/kava.png"),
      8453: useImage("assets/images/networks/base.png"),
      59144: useImage("assets/images/networks/linea.png"),
    },
    chains,
  });
  const web3modal = useWeb3Modal();

  return { web3modal, ethereumClient };
};

const createPublicClient = (chains: Chain[], projectId: string) => {
  if (projectId) return configureChains(chains, [publicProvider()]);
  return configureChains(chains, [
    publicProvider(),
    walletConnectProvider({ projectId }),
  ]);
};

const createConnectors = (chains: Chain[], projectId: string) => {
  const metadata = {
    name: "Web3Modal",
    description: "Web3Modal Example",
    url: "https://web3modal.com",
    icons: ["https://avatars.githubusercontent.com/u/37784886"],
  };

  const connectors: (
    | WalletConnectConnector
    | EIP6963Connector
    | InjectedConnector
    | CoinbaseWalletConnector
  )[] = [
    new EIP6963Connector({ chains }),
    new InjectedConnector({ chains, options: { shimDisconnect: true } }),
    new CoinbaseWalletConnector({
      chains,
      options: { appName: metadata.name },
    }),
  ];

  if (projectId)
    connectors.push(
      new WalletConnectConnector({
        chains,
        options: {
          projectId,
          showQrModal: false,
          metadata,
        },
      })
    );

  return connectors;
};
