import { linea } from "@wagmi/core/chains";
import { useImage } from "@/helpers/useImage";

export const lineaConfig = {
  ...linea,
  rpcUrls: {
    public: {
      http: [
        linea.rpcUrls.default.http[0],
        "https://linea.decubate.com",
        "https://linea.drpc.org",
        "https://1rpc.io/linea",
        "https://linea.blockpi.network/v1/rpc/public",
      ],
    },
    default: {
      http: [
        linea.rpcUrls.default.http[0],
        "https://linea.decubate.com",
        "https://linea.drpc.org",
        "https://1rpc.io/linea",
        "https://linea.blockpi.network/v1/rpc/public",
      ],
    },
  },
  chainId: linea.id,
  chainName: "Linea",
  symbol: "Linea",
  icon: useImage("assets/images/networks/linea.png"),
  baseTokenIcon: useImage("assets/images/tokens/ETH.png"),
  baseTokenSymbol: "ETH",
  networkIcon: useImage(`assets/images/networks/linea.png`),
  lzChainId: 183,
};
