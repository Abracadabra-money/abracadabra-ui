import store from "@/store";
import { markRaw } from "vue";
import { providers } from "ethers";
import { defaultRpc } from "@/helpers/chains";

export const initWithoutConnect = async () => {
  const chainId = +(localStorage.getItem("MAGIC_MONEY_CHAIN_ID") || 1);

  const unsupportedChain = !defaultRpc[chainId as keyof typeof defaultRpc];
  const currentRpc = unsupportedChain
    ? defaultRpc[1]
    : defaultRpc[chainId as keyof typeof defaultRpc];
  const currentChain = unsupportedChain ? 1 : chainId;

  const provider = markRaw(new providers.StaticJsonRpcProvider(currentRpc));

  store.commit("setChainId", currentChain);
  store.commit("setProvider", provider);
  store.commit("setWalletConnection", true);
};
