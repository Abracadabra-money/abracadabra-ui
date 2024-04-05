import { reconnect } from "@wagmi/core";
import { createWeb3Modal } from "@web3modal/wagmi/vue";
import { createWagmiConfig } from "@/plugins/walletConnect/utils";

const projectId = import.meta.env.VITE_APP_CONNECT_KEY;

export const initWeb3Modal = async () => {
  const wagmiConfig = createWagmiConfig(projectId);

  reconnect(wagmiConfig);

  const web3modal = await createWeb3Modal({
    wagmiConfig: wagmiConfig,
    projectId,
    enableAnalytics: true, // Optional - defaults to your Cloud configuration
    enableOnramp: true, // Optional - false as default
  });

  return { web3modal, wagmiConfig };
};
