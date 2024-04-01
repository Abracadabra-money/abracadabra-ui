import { useImage } from "@/helpers/useImage";

export const blastSepoliaConfig = {
  id: 168587773,
  chainId: 168587773,
  name: "Blast Sepolia",
  network: "blast-sepolia",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    public: {
      http: [
        "https://blast-sepolia.blockpi.network/v1/rpc/public",
      ],
    },
    default: {
      http: [
        "https://blast-sepolia.blockpi.network/v1/rpc/public",
      ],
    },
  },
  blockExplorers: {
    etherscan: { name: "Blast Sepolia Explorer", url: "https://testnet.blastscan.io/" },
    default: { name: "Blast Sepolia Explorer", url: "https://testnet.blastscan.io/" },
  },
    contracts: {
      multicall3: {
        address: "0xcA11bde05977b3631167028862bE2a173976CA11",
        blockCreated: 756690,
      },
    },
  symbol: "ETH",
  chainName: "Blast Sepolia",
  icon: useImage("assets/images/networks/blast.png"),
  baseTokenIcon: useImage("assets/images/tokens/ETH.png"),
  baseTokenSymbol: "ETH",
  networkIcon: useImage(`assets/images/networks/blast.png`),
  //   lzChainId: 184,
};
