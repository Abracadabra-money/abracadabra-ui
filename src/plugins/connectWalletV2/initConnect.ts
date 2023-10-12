import store from "@/store";
import { markRaw } from "vue";
import { providers } from "ethers";
import { defaultRpc } from "@/helpers/chains";
import { watchAccount, watchNetwork } from "@wagmi/core";
import { getEthersSigner } from "@/plugins/connectWalletV2/getEthersSigner";
import { checkSanctionAddress } from "@/plugins/connectWalletV2/checkSanctionAddress";
import type { EthereumClient } from "@web3modal/ethereum";

export const onConnectNew = async (ethereumClient: EthereumClient) => {
  try {
    const account = await ethereumClient.getAccount().address;
    const activeChain = await ethereumClient.getNetwork().chain;
    const chainId = activeChain!.id;
    const unsupportedChain = !defaultRpc[chainId as keyof typeof defaultRpc];
    const currentRpc = unsupportedChain
      ? defaultRpc[1]
      : defaultRpc[chainId as keyof typeof defaultRpc];

    if (!unsupportedChain) {
      localStorage.setItem("MAGIC_MONEY_CHAIN_ID", chainId.toString());
    }

    if (await checkSanctionAddress(account!)) return false;

    watchAccount(({ address }) => {
      if (account !== address) window.location.reload();
    });

    watchNetwork((network) => {
      if (chainId !== network.chain?.id) window.location.reload();
    });

    const provider = markRaw(new providers.StaticJsonRpcProvider(currentRpc));

    const signer = unsupportedChain
      ? provider
      : await getEthersSigner({ chainId });

    store.commit("setChainId", chainId);
    store.commit("setProvider", provider);
    store.commit("setSigner", markRaw(signer!)); // WARN
    store.commit("setAccount", account);
    store.dispatch("checkENSName", account);
    store.commit("setWalletConnection", true);
  } catch (error) {
    console.log("Connection error: ", error);
  }
};
