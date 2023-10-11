import { useImage } from "@/helpers/useImage";
import { avalanche } from "@wagmi/core/chains";

export const avalancheConfig = {
  ...avalanche,
  symbol: "AVAX",
  icon: useImage("assets/images/networks/arbitrum-icon.svg"),
  baseTokenIcon: useImage("assets/images/tokens/AVAX.png"),
  lzChainId: 106,
  switchData: {
    chainId: "0xa86a",
    chainName: "Avalanche Mainnet",
    rpcUrls: ["https://api.avax.network/ext/bc/C/rpc"],
    blockExplorerUrls: ["https://cchain.explorer.avax.network/"],
  },
};
