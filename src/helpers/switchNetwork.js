import { getWalletClient } from "@wagmi/core";

import {
  mainnet,
  optimism,
  bsc,
  polygon,
  fantom,
  moonriver,
  arbitrum,
  avalanche,
} from "@wagmi/core/chains";
import { kava } from "@/plugins/connectWallet/chains/kava";
import { base } from "@/plugins/connectWallet/chains/base";

const chains = {
  1: mainnet,
  10: optimism,
  56: bsc,
  137: polygon,
  250: fantom,
  1285: moonriver,
  2222: kava,
  8453: base,
  42161: arbitrum,
  43114: avalanche,
};

export default async (chainId) => {
  const walletClient = await getWalletClient();
  if (walletClient) {
    try {
      await walletClient.switchChain({ id: chainId });
    } catch (error) {
      if (String(error).indexOf("Unrecognized chain ID") !== -1) {
        await walletClient.addChain({ chain: chains[chainId] });
        await walletClient.switchChain({ id: chainId });
      }
    }
  } else {
    localStorage.setItem("MAGIC_MONEY_CHAIN_ID", chainId);
    window.location.reload();
  }
};
