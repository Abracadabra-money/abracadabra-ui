import { fantom } from "@wagmi/core/chains";
import { useImage } from "@/helpers/useImage";
import { initPublicClient } from "@/helpers/chains/initPublicClient";

const http = [
  fantom.rpcUrls.default.http[0],
  "https://1rpc.io/ftm",
  "https://fantom-rpc.publicnode.com",
  "https://rpcapi.fantom.network",
  "https://fantom-mainnet.public.blastapi.io",
];

const viemConfig = {
  ...fantom,
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

export const fantomConfig = {
  publicClient,
  viemConfig: viemConfig,
  chainId: fantom.id,
  chainName: "Fantom",
  symbol: "FTM",
  icon: useImage("assets/images/networks/fantom-icon.svg"),
  baseTokenIcon: useImage("assets/images/tokens/FTM2.png"),
  baseTokenSymbol: "FTM",
  networkIcon: useImage(`assets/images/networks/fantom.svg`),
  lzChainId: 112,
};
