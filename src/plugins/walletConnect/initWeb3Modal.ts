import { reconnect } from "@wagmi/core";
import { getChainsConfigs } from "@/helpers/getChainsConfigs";
import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/vue";

export const initWeb3Modal = async () => {
  // 1. Define constants
  const { chains } = getChainsConfigs();
  const projectId = import.meta.env.VITE_APP_CONNECT_KEY;

  // 2. Create wagmiConfig
  const metadata = {
    name: "Web3Modal",
    description: "Web3Modal Example",
    url: "https://app.abracadabra.money/#/", // origin your domain & subdomain
    icons: ["https://avatars.githubusercontent.com/u/37784886"],
  };

  const wagmiConfig = defaultWagmiConfig({
    chains,
    projectId,
    metadata,
    // ...wagmiOptions // Optional - Override createConfig parameters
  });

  reconnect(wagmiConfig);

  const web3modal = await createWeb3Modal({
    wagmiConfig: wagmiConfig,
    projectId,
    enableAnalytics: true, // Optional - defaults to your Cloud configuration
    enableOnramp: true, // Optional - false as default
  });

  return { web3modal, wagmiConfig };
};
