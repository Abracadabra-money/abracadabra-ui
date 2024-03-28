import { linea } from "@wagmi/core/chains";
import { useImage } from "@/helpers/useImage";
import { initPublicClient } from "@/helpers/chains/initPublicClient";

const http = [
  linea.rpcUrls.default.http[0],
  "https://linea.decubate.com",
  "https://linea.drpc.org",
  "https://1rpc.io/linea",
  "https://linea.blockpi.network/v1/rpc/public",
];

const viemConfig = {
  ...linea,
  rpcUrls: {
    public: {
      http,
    },
    default: {
      http,
    },
  },
};

const publicClient = initPublicClient(viemConfig);

export const lineaConfig = {
  publicClient,
  viemConfig: viemConfig,
  chainId: linea.id,
  chainName: "Linea",
  symbol: "Linea",
  icon: useImage("assets/images/networks/linea.png"),
  baseTokenIcon: useImage("assets/images/tokens/ETH.png"),
  baseTokenSymbol: "ETH",
  networkIcon: useImage(`assets/images/networks/linea.png`),
  lzChainId: 183,
};
