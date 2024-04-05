import store from "@/store";
import { getWalletClient, switchChain } from "@wagmi/core";

export const getWalletClientHelper = async () => {
  try {
    return await getWalletClient(store.getters.getWagmiConfig);
  } catch (error) {
    return null;
  }
};

export const switchChainHelper = async (chainId: number) => {
  await switchChain(store.getters.getWagmiConfig, { chainId });
};
