import { useImage } from "@/helpers/useImage";
import { avalanche } from "@wagmi/core/chains";

export const avalancheConfig = {
  ...avalanche,
  rpcUrls: {
    public: {
      http: [
        "https://api.avax.network/ext/bc/C/rpc",
        "https://avalanche.drpc.org",
        "https://rpc.tornadoeth.cash/avax",
        "https://avalanche.drpc.org",
      ],
    },
    default: {
      http: [
        "https://api.avax.network/ext/bc/C/rpc",
        "https://avalanche.drpc.org",
        "https://rpc.tornadoeth.cash/avax",
        "https://avalanche.drpc.org"
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
