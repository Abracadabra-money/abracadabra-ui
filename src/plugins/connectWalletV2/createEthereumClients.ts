import { Web3Modal } from "@web3modal/html";
import { EthereumClient, w3mConnectors } from "@web3modal/ethereum";
import { chains, chainsList } from "@/helpers/chains";
import { configureChains, createConfig } from "@wagmi/core";
import { walletConnectProvider } from "@web3modal/wagmi";

import { publicProvider } from "@wagmi/core/providers/public";
import { w3mProvider } from "@web3modal/ethereum";

import { createWeb3Modal, useWeb3Modal } from "@web3modal/wagmi/vue";
import { useImage } from "@/helpers/useImage";

export const createEthereumClients = async () => {
  // 1. Define constants
  const projectId = import.meta.env.VITE_APP_CONNECT_KEY;
  if (!projectId) throw new Error("You need to provide projectId env");

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
    connectors: w3mConnectors({
      chains,
      version: 1,
      projectId,
      options: { metadata },
    }),
    publicClient,
  });

  // 3. Create ethereum and modal clients
  const ethereumClient = new EthereumClient(wagmiConfig, chains);

  createWeb3Modal(
    {
      wagmiConfig,
      projectId,
      themeMode: "dark",
      themeVariables: {
        "--w3m-font-family": "'Prompt', sans-serif",
        "--w3m-background-color": "rgba(60, 60, 60, 0.8)",
        "--w3m-accent-color": "#76c3f5",
        "--w3m-z-index": "1000",
      },
      chainImages: {
        2222: useImage("assets/images/networks/kava.png"),
        8453: useImage("assets/images/networks/base.png"),
        59144: useImage("assets/images/networks/linea.png"),
      },
      chains,
    },
    ethereumClient
  );
  const web3modal = useWeb3Modal();

  return { web3modal, ethereumClient };
};
