// @ts-ignore
import store from "@/store";
import { switchChain } from "@wagmi/core";
import { getConfigByChainId } from "@/helpers/connect/configs";
import { getWalletClientHelper } from "@/helpers/walletClienHelper";
import { createOrUpdateWithoutConnectInfo } from "@/helpers/connect/createOrUpdateConnection";

export const switchNetwork = async (chainId: number) => {
  const walletClient = await getWalletClientHelper();
  const wagmiConfig = store.getters.getWagmiConfig;

  if (walletClient) {
    try {
      localStorage.setItem("MAGIC_MONEY_CHAIN_ID", chainId.toString());
      await switchChain(wagmiConfig, { chainId: Number(chainId) });
    } catch (error) {
      if (String(error).indexOf("Chain not configured") !== -1) {
        await walletClient.addChain({ chain: getConfigByChainId(chainId) });
        await walletClient.switchChain({ id: chainId });
      }
    }
  } else {
    localStorage.setItem("MAGIC_MONEY_CHAIN_ID", chainId.toString());
    createOrUpdateWithoutConnectInfo(wagmiConfig);
  }
};
