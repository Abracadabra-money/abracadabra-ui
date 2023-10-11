import store from "@/store";
import { markRaw } from "vue";
import { providers } from "ethers";
import { watchAccount } from "@wagmi/core";
import { defaultRpc } from "@/helpers/chains";
import type { EthereumClient } from "@web3modal/ethereum";

export const initWithoutConnect = async (ethereumClient: EthereumClient) => {
  const chainId = +(localStorage.getItem("MAGIC_MONEY_CHAIN_ID") || 1);

  const unsupportedChain = !defaultRpc[chainId as keyof typeof defaultRpc];
  const currentRpc = unsupportedChain
    ? defaultRpc[1]
    : defaultRpc[chainId as keyof typeof defaultRpc];
  const currentChain = unsupportedChain ? 1 : chainId;

  const provider = markRaw(new providers.StaticJsonRpcProvider(currentRpc));

  const account = ethereumClient.getAccount().address;
  watchAccount(({ address }) => {
    if (account !== address) window.location.reload();
  });

  store.commit("setChainId", currentChain);
  store.commit("setProvider", provider);
  store.commit("setAccount", null);
  store.commit("setWalletConnection", true);
};
