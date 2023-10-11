import { arbitrum } from "@wagmi/core/chains";
import { useImage } from "@/helpers/useImage";

export const arbitrumConfig = {
  ...arbitrum,
  symbol: "AETH",
  icon: useImage("assets/images/networks/arbitrum-icon.svg"),
  baseTokenIcon: useImage("assets/images/tokens/ETH.png"),
  lzChainId: 110,
  switchData: {
    chainId: "0xa4b1",
    chainName: "Arbitrum One",
    rpcUrls: ["https://arb1.arbitrum.io/rpc"],
    blockExplorerUrls: ["https://arbiscan.io"],
  },
};
