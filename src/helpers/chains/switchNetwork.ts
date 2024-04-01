import { getWalletClient } from "@wagmi/core";
import { onConnectNew } from "@/plugins/connectWallet/initConnect";
import { createEthereumClients } from "@/plugins/connectWallet/createEthereumClients";
import { getChainConfig } from "@/helpers/chains/getChainsInfo";

export const switchNetwork = async (chainId: number) => {
  const walletClient = await getWalletClient();
  if (walletClient) {
    try {
      localStorage.setItem("MAGIC_MONEY_CHAIN_ID", chainId.toString());
      await walletClient.switchChain({ id: chainId });
    } catch (error) {
      if (String(error).indexOf("Unrecognized chain ID") !== -1) {
        const chainConfig: any = getChainConfig(chainId);
        await walletClient.addChain({
          chain: chainConfig?.viemConfig,
        });
        await walletClient.switchChain({ id: chainId });
      }
    }
  } else {
    localStorage.setItem("MAGIC_MONEY_CHAIN_ID", chainId.toString());
    const { ethereumClient } = createEthereumClients();
    onConnectNew(ethereumClient!);
  }
};
