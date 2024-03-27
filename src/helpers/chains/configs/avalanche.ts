import { useImage } from "@/helpers/useImage";
import { avalanche } from "@wagmi/core/chains";

export const avalancheConfig = {
  ...avalanche,
  rpcUrls: {
    public: {
      http: [
        avalanche.rpcUrls.default.http[0],
        "https://avalanche.drpc.org",
        "https://rpc.ankr.com/avalanche",
        "https://avalanche-c-chain-rpc.publicnode.com",
        "https://api.avax.network/ext/bc/C/rpc",
      ],
    },
    default: {
      http: [
        avalanche.rpcUrls.default.http[0],
        "https://avalanche.drpc.org",
        "https://rpc.ankr.com/avalanche",
        "https://avalanche-c-chain-rpc.publicnode.com",
        "https://api.avax.network/ext/bc/C/rpc",
      ],
    },
  },
  chainId: avalanche.id,
  chainName: "Avalanche",
  symbol: "AVAX",
  icon: useImage("assets/images/networks/avalanche.svg"),
  baseTokenIcon: useImage("assets/images/tokens/AVAX.png"),
  baseTokenSymbol: "AVAX",
  networkIcon: useImage(`assets/images/networks/avalanche.svg`),
  lzChainId: 106,
};
