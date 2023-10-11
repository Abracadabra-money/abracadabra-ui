import { optimism } from "@wagmi/core/chains";
import { useImage } from "@/helpers/useImage";

export const optimismConfig = {
  ...optimism,
  symbol: "OP",
  icon: useImage("assets/images/networks/optimism-icon.svg"),
  baseTokenIcon: useImage("assets/images/tokens/ETH.png"),
  lzChainId: 111,
  switchData: {
    chainId: "0xa",
    chainName: "Optimism (mainnet)",
    rpcUrls: ["https://mainnet.optimism.io"],
    blockExplorerUrls: ["https://optimistic.etherscan.io"],
  },
};
