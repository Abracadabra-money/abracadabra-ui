import { getWalletClient } from "@wagmi/core";
import { chainsList } from "@/helpers/chains/index";

export const switchNetwork = async (chainId: number) => {
  const walletClient = await getWalletClient();
  if (walletClient) {
    try {
      localStorage.setItem("MAGIC_MONEY_CHAIN_ID", chainId.toString());
      await walletClient.switchChain({ id: chainId });
    } catch (error) {
      if (String(error).indexOf("Unrecognized chain ID") !== -1) {
        await walletClient.addChain({
          chain: chainsList[chainId as keyof typeof chainsList],
        });
        await walletClient.switchChain({ id: chainId });
      }
    }
  } else {
    localStorage.setItem("MAGIC_MONEY_CHAIN_ID", chainId.toString());
    window.location.reload();
  }
};
