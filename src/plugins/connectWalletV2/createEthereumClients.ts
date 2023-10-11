import { Web3Modal } from "@web3modal/html";
import { EthereumClient } from "@web3modal/ethereum";
import { chains, chainsList } from "@/helpers/chains";
import { configureChains, createConfig } from "@wagmi/core";
import { publicProvider } from "@wagmi/core/providers/public";
import { w3mConnectors, w3mProvider } from "@web3modal/ethereum";

export const createEthereumClients = async () => {
  // 1. Define constants
  const projectId = import.meta.env.VITE_APP_CONNECT_KEY;
  if (!projectId) throw new Error("You need to provide projectId env");

  // 2. Configure wagmi client
  const { publicClient } = configureChains(chains, [
    publicProvider(),
    w3mProvider({ projectId }),
  ]);

  const wagmiConfig = createConfig({
    autoConnect: true,
    /* @ts-ignore */
    connectors: w3mConnectors({ chains, version: 1, projectId }),
    publicClient,
  });

  // 3. Create ethereum and modal clients
  const ethereumClient = new EthereumClient(wagmiConfig, chains);
  const web3modal = new Web3Modal(
    {
      projectId,
      themeMode: "dark",
      themeVariables: {
        "--w3m-font-family": "'Prompt', sans-serif",
        "--w3m-background-color": "rgba(60, 60, 60, 0.8)",
        "--w3m-accent-color": "#76c3f5",
        "--w3m-z-index": "1000",
      },
      chainImages: {
        2222: chainsList[2222].icon,
        8453: chainsList[8453].icon,
        59144: chainsList[59144].icon,
      },
    },
    ethereumClient
  );

  return { web3modal, ethereumClient };
};
