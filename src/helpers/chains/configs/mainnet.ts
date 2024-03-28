import { RPC_ETH } from "@/constants/rpc";
import { mainnet } from "@wagmi/core/chains";
import { useImage } from "@/helpers/useImage";
import { initPublicClient } from "@/helpers/chains/initPublicClient";

const http = [
  RPC_ETH,
  "https://eth.llamarpc.com",
  "https://ethereum-rpc.publicnode.com	",
  "https://eth.drpc.org",
  "https://rpc.ankr.com/eth",
];

const viemConfig = {
  ...mainnet,
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

export const mainnetConfig = {
  publicClient,
  viemConfig: viemConfig,
  chainId: mainnet.id,
  chainName: "Ethereum",
  symbol: "ETH",
  icon: useImage("assets/images/networks/ethereum-icon.svg"),
  baseTokenIcon: useImage("assets/images/tokens/ETH.png"),
  baseTokenSymbol: "ETH",
  networkIcon: useImage(`assets/images/networks/ethereum.svg`),
  lzChainId: 101,
};
