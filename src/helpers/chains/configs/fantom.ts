import { fantom } from "@wagmi/core/chains";
import { useImage } from "@/helpers/useImage";

export const fantomConfig = {
  ...fantom,
  symbol: "FTM",
  icon: useImage("assets/images/networks/fantom-icon.svg"),
  baseTokenIcon: useImage("assets/images/tokens/FTM2.png"),
  lzChainId: 112,
  switchData: {
    chainId: "0xfa",
    chainName: "Fantom Opera Mainnet",
    rpcUrls: ["https://rpcapi.fantom.network/", "https://rpc.fantom.network/"],
    iconUrls: ["https://ftmscan.com/images/logo-ftmscan.svg?v=0.0.2"],
    blockExplorerUrls: ["https://ftmscan.com/"],
    nativeCurrency: {
      name: "Fantom",
      symbol: "FTM",
      decimals: 18,
    },
  },
};
