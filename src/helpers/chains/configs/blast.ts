import { useImage } from "@/helpers/useImage";
import { initPublicClient } from "@/helpers/chains/initPublicClient";

const http = [
  "https://rpc.blast.io",
  "https://blast.din.dev/rpc",
  "https://blast.blockpi.network/v1/rpc/public",
  "https://blastl2-mainnet.public.blastapi.io",
  "https://rpc.ankr.com/blast",
];

const viemConfig = {
  blockExplorers: {
    etherscan: {
      name: "Blast Sepolia Explorer",
      url: "https://81457.routescan.io/",
    },
    default: {
      name: "Blast Sepolia Explorer",
      url: "https://81457.routescan.io/",
    },
  },
  contracts: {
    multicall3: {
      address: "0xcA11bde05977b3631167028862bE2a173976CA11",
      blockCreated: 88189,
    },
  },
  id: 81457,
  fees: undefined,
  formatters: undefined,
  chainId: 81457,
  name: "Blast",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  network: "blast-mainnet",
  rpcUrls: {
    public: {
      http,
    },
    default: {
      http,
    },
  },
  serializers: undefined,
};

const publicClient = initPublicClient(viemConfig);

export const blastConfig = {
  publicClient,
  viemConfig: viemConfig,
  chainId: viemConfig.id,
  chainName: "Blast",
  symbol: "ETH",
  icon: useImage("assets/images/networks/blast.png"),
  baseTokenIcon: useImage("assets/images/tokens/ETH.png"),
  baseTokenSymbol: "ETH",
  networkIcon: useImage(`assets/images/networks/blast.png`),
  lzChainId: 243,
};
