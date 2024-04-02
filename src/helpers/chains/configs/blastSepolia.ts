import { useImage } from "@/helpers/useImage";
import { initPublicClient } from "@/helpers/chains/initPublicClient";

const rpcList = ["https://blast-sepolia.blockpi.network/v1/rpc/public"];

const viemConfig = {
  blockExplorers: {
    etherscan: {
      name: "Blast Sepolia Explorer",
      url: "https://testnet.blastscan.io/",
    },
    default: {
      name: "Blast Sepolia Explorer",
      url: "https://testnet.blastscan.io/",
    },
  },
  contracts: {
    multicall3: {
      address: "0xcA11bde05977b3631167028862bE2a173976CA11",
      blockCreated: 756690,
    },
  },
  id: 168587773,
  fees: undefined,
  formatters: undefined,
  name: "Blast Sepolia",
  network: "blast-sepolia",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    public: {
      http: rpcList,
    },
    default: {
      http: rpcList,
    },
  },
  serializers: undefined,
};

const publicClient = initPublicClient(viemConfig);

export const blastSepoliaConfig = {
  publicClient,
  viemConfig: viemConfig,
  chainId: viemConfig.id,
  symbol: "Blast Sepolia",
  chainName: "Blast Sepolia",
  icon: useImage("assets/images/networks/blast.png"),
  baseTokenIcon: useImage("assets/images/tokens/ETH.png"),
  baseTokenSymbol: "ETH",
  networkIcon: useImage(`assets/images/networks/blast.png`),
  //   lzChainId: 184,
};
