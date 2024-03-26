import { polygon } from "@wagmi/core/chains";
import { useImage } from "@/helpers/useImage";

export const polygonConfig = {
  ...polygon,
  rpcUrls: {
    public: {
      http: [
        "https://polygon.llamarpc.com",
        "https://polygon-pokt.nodies.app",
        "https://rpc.ankr.com/polygon",
        "https://polygon.meowrpc.com",
        "https://polygon-bor-rpc.publicnode.com",
      ],
    },
    default: {
      http: [
        "https://polygon.llamarpc.com",
        "https://polygon-pokt.nodies.app",
        "https://rpc.ankr.com/polygon",
        "https://polygon.meowrpc.com",
        "https://polygon-bor-rpc.publicnode.com",
      ],
    },
  },
  chainId: polygon.id,
  chainName: "MATIC",
  symbol: "MATIC",
  icon: useImage("assets/images/networks/polygon-icon.svg"),
  baseTokenIcon: useImage("assets/images/tokens/MATIC.png"),
  baseTokenSymbol: "MATIC",
  networkIcon: useImage(`assets/images/networks/polygon.svg`),
  lzChainId: 109,
};
