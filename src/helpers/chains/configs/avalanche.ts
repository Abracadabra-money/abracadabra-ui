import { useImage } from "@/helpers/useImage";
import { avalanche } from "@wagmi/core/chains";
import { initPublicClient } from "@/helpers/chains/initPublicClient";

const http = [
  avalanche.rpcUrls.default.http[0],
  "https://avalanche.drpc.org",
  "https://rpc.ankr.com/avalanche",
  "https://avalanche-c-chain-rpc.publicnode.com",
  "https://api.avax.network/ext/bc/C/rpc",
];

const viemConfig = {
  ...avalanche,
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

export const avalancheConfig = {
  publicClient,
  viemConfig: viemConfig,
  chainId: avalanche.id,
  chainName: "Avalanche",
  symbol: "AVAX",
  icon: useImage("assets/images/networks/avalanche.svg"),
  baseTokenIcon: useImage("assets/images/tokens/AVAX.png"),
  baseTokenSymbol: "AVAX",
  networkIcon: useImage(`assets/images/networks/avalanche.svg`),
  lzChainId: 106,
};
