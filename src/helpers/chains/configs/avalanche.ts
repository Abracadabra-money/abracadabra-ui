import { useImage } from "@/helpers/useImage";
import { avalanche } from "@wagmi/core/chains";

export const avalancheConfig = {
  ...avalanche,
  rpcUrls: {
    public: {
      http: [
        "https://avalanche.drpc.org",
        "https://rpc.ankr.com/avalanche",
        "https://api.avax.network/ext/bc/C/rpc",
        "https://rpc.tornadoeth.cash/avax",
        "https://avax-pokt.nodies.app/ext/bc/C/rpc",
      ],
    },
    default: {
      http: [
        "https://avalanche.drpc.org",
        "https://rpc.ankr.com/avalanche",
        "https://api.avax.network/ext/bc/C/rpc",
        "https://rpc.tornadoeth.cash/avax",
        "https://avax-pokt.nodies.app/ext/bc/C/rpc",
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
