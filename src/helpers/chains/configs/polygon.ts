import { polygon } from "@wagmi/core/chains";
import { useImage } from "@/helpers/useImage";

export const polygonConfig = {
  ...polygon,
  rpcUrls: {
    public: {
      http: [
        polygon.rpcUrls.default.http[0],
        "https://polygon.llamarpc.com",
        "https://endpoints.omniatech.io/v1/matic/mainnet/public",
        "https://rpc-mainnet.maticvigil.com",
        "https://polygon-rpc.com",
      ],
    },
    default: {
      http: [
        polygon.rpcUrls.default.http[0],
        "https://polygon.llamarpc.com",
        "https://endpoints.omniatech.io/v1/matic/mainnet/public",
        "https://rpc-mainnet.maticvigil.com",
        "https://polygon-rpc.com",
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
