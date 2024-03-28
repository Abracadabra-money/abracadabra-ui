import { bsc } from "@wagmi/core/chains";
import { useImage } from "@/helpers/useImage";
import { initPublicClient } from "@/helpers/chains/initPublicClient";

const http = [
  bsc.rpcUrls.default.http[0],
  "https://bsc-dataseed1.ninicoin.io",
  "https://bsc-dataseed2.ninicoin.io",
  "https://bsc-dataseed3.ninicoin.io",
  "https://binance.llamarpc.com",
];

const viemConfig = {
  ...bsc,
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

export const binanceConfig = {
  publicClient,
  viemConfig: viemConfig,
  chainId: bsc.id,
  chainName: "BNB Chain",
  symbol: "BSC",
  icon: useImage("assets/images/networks/binance-icon.svg"),
  baseTokenIcon: useImage("assets/images/tokens/BNB.png"),
  baseTokenSymbol: "BNB",
  networkIcon: useImage(`assets/images/networks/binance.svg`),
  lzChainId: 102,
};
