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

export const createEthereumClients = () => {
  // 1. Define constants
  const { chains } = getChainsConfigs();

  const projectId = import.meta.env.VITE_APP_CONNECT_KEY;
  if (!projectId) {
    const { publicClient } = configureChains(chains, [publicProvider()]);
    createConfig({
      autoConnect: true,
      publicClient,
    });
    console.log("Connect env error: \nYou need to provide projectId env");
    store.dispatch("notifications/new", notification.connectEnvError);
    return {};
  }

  const metadata = {
    name: "Web3Modal",
    description: "Web3Modal Example",
    url: "https://web3modal.com",
    icons: ["https://avatars.githubusercontent.com/u/37784886"],
  };

  // 2. Configure wagmi client
  const { publicClient } = configureChains(chains, [
    publicProvider(),
    walletConnectProvider({ projectId }),
  ]);

  const wagmiConfig = createConfig({
    autoConnect: true,
    connectors: [
      new WalletConnectConnector({
        chains,
        options: { projectId, showQrModal: false, metadata },
      }),
      new EIP6963Connector({ chains }),
      new InjectedConnector({ chains, options: { shimDisconnect: true } }),
      new CoinbaseWalletConnector({
        chains,
        options: { appName: metadata.name },
      }),
    ],
    publicClient,
  });

  // 3. Create ethereum and modal clients
  const ethereumClient = new EthereumClient(wagmiConfig, chains);

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
