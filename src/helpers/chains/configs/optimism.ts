import { optimism } from "@wagmi/core/chains";
import { useImage } from "@/helpers/useImage";
import { initPublicClient } from "@/helpers/chains/initPublicClient";

const http = [
  "https://optimism.llamarpc.com",
  optimism.rpcUrls.default.http[0],
  "https://optimism-mainnet.public.blastapi.io",
  "https://rpc.ankr.com/optimism",
  "https://1rpc.io/op",
];

const viemConfig = {
  ...optimism,
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

export const optimismConfig = {
  publicClient,
  viemConfig: viemConfig,
  chainId: optimism.id,
  chainName: "Optimism",
  symbol: "OP",
  icon: useImage("assets/images/networks/optimism-icon.svg"),
  baseTokenIcon: useImage("assets/images/tokens/ETH.png"),
  baseTokenSymbol: "ETH",
  networkIcon: useImage(`assets/images/networks/optimism.svg`),
  lzChainId: 111,
};
