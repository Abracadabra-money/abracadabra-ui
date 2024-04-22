import { useImage } from "@/helpers/useImage";
import { avalanche } from "@wagmi/core/chains";
import { filterRpcUrls } from "@/helpers/chains/utils";
import { initPublicClient } from "@/helpers/chains/initPublicClient";
import { initStaticJsonRpcProvider } from "@/helpers/chains/initStaticJsonRpcProvider";

const rpcList = filterRpcUrls(avalanche, [
  "https://avalanche.drpc.org",
  "https://rpc.ankr.com/avalanche",
  "https://avalanche-c-chain-rpc.publicnode.com",
  "https://api.avax.network/ext/bc/C/rpc",
]);

const viemConfig = {
  ...avalanche,
  rpcUrls: {
    public: {
      http: rpcList,
    },
    default: {
      http: rpcList,
    },
  },
};

const publicClient = initPublicClient(viemConfig);
const ethersProvider = await initStaticJsonRpcProvider(avalanche.id);

export const avalancheConfig = {
  publicClient,
  ethersProvider,
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
