import {
  getWalletClientHelper,
  switchChainHelper,
} from "@/helpers/walletClienHelper";
import { getChainConfig } from "@/helpers/chains/getChainsInfo";
import { createWagmiConfig } from "@/plugins/walletConnect/utils";
import { initWithoutConnect } from "@/plugins/walletConnect/initConnect";

export const switchNetwork = async (chainId: number) => {
  const walletClient = await getWalletClientHelper();

  if (walletClient) {
    try {
      localStorage.setItem("MAGIC_MONEY_CHAIN_ID", chainId.toString());
      await switchChainHelper(+chainId);
    } catch (error) {
      if (String(error).indexOf("Chain not configured") !== -1) {
        const chainConfig: any = getChainConfig(chainId);
        await walletClient.addChain({
          chain: chainConfig?.viemConfig,
        });
        await walletClient.switchChain({ id: chainId });
      }
    }
  } else {
    localStorage.setItem("MAGIC_MONEY_CHAIN_ID", chainId.toString());
    const wagmiConfig = createWagmiConfig(import.meta.env.VITE_APP_CONNECT_KEY);
    initWithoutConnect(wagmiConfig);
  }
};
