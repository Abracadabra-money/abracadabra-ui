import { useImage } from "@/helpers/useImage";

export const baseConfig = {
  id: 8453,
  chainId: 8453,
  name: "Base",
  network: "base-mainnet",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    public: {
      http: [
        "https://mainnet.base.org",
        "https://base.llamarpc.com",
        "https://gateway.subquery.network/rpc/base",
        "https://base.drpc.org",
        "https://base-rpc.publicnode.com",
      ],
    },
    default: {
      http: [
        "https://mainnet.base.org",
        "https://base.llamarpc.com",
        "https://gateway.subquery.network/rpc/base",
        "https://base.drpc.org",
        "https://base-rpc.publicnode.com",
      ],
    },
  },
  blockExplorers: {
    etherscan: { name: "Basescan", url: "https://basescan.org" },
    default: { name: "Basescan", url: "https://basescan.org" },
  },
  contracts: {
    multicall3: {
      address: "0xcA11bde05977b3631167028862bE2a173976CA11",
      blockCreated: 5022,
    },
  },
  chainName: "BASE",
  symbol: "Base",
  icon: useImage("assets/images/networks/base.png"),
  baseTokenIcon: useImage("assets/images/tokens/ETH.png"),
  baseTokenSymbol: "ETH",
  networkIcon: useImage(`assets/images/networks/base.png`),
  lzChainId: 184,
};
