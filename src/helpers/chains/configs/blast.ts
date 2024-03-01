import { useImage } from "@/helpers/useImage";

export const blastConfig = {
  id: 81457,
  chainId: 81457,
  name: "Blast",
  network: "blast-mainnet",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    public: {
      http: ["https://rpc.ankr.com/blast"],
    },
    default: {
      http: ["https://rpc.ankr.com/blast"],
    },
  },
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
  symbol: "ETH",
  chainName: "Blast",
  icon: useImage("assets/images/networks/blast.png"),
  baseTokenIcon: useImage("assets/images/tokens/ETH.png"),
  baseTokenSymbol: "ETH",
  networkIcon: useImage(`assets/images/networks/blast.png`),
  lzChainId: 243,
};
