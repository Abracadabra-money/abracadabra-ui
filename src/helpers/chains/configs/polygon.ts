import { polygon } from "@wagmi/core/chains";
import { useImage } from "@/helpers/useImage";

export const polygonConfig = {
  ...polygon,
  symbol: "MATIC",
  icon: useImage("assets/images/networks/polygon-icon.svg"),
  baseTokenIcon: useImage("assets/images/tokens/MATIC.png"),
  lzChainId: 109,
  switchData: {
    chainId: "0x89",
    chainName: "Polygon Mainnet",
    rpcUrls: ["https://polygon-rpc.com/"],
    iconUrls: ["https://polygonscan.com/images/svg/brands/polygon.svg"],
    blockExplorerUrls: ["https://polygonscan.com/"],
    nativeCurrency: {
      name: "Polygon",
      symbol: "MATIC",
      decimals: 18,
    },
  },
};
