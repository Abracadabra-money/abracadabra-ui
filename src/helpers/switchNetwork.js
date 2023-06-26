import { getWalletClient } from "@wagmi/core";

export default async (chainId) => {
  const walletClient = await getWalletClient();
  if (walletClient) {
    await walletClient.switchChain({ id: chainId });
  } else {
    localStorage.setItem("MAGIC_MONEY_CHAIN_ID", chainId);
    window.location.reload();
  }
};
