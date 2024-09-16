import { polygon } from "@wagmi/core/chains";
import { useImage } from "@/helpers/useImage";
import { filterRpcUrls } from "@/helpers/chains/utils";
import { initPublicClient } from "@/helpers/chains/initPublicClient";
import { initStaticJsonRpcProvider } from "@/helpers/chains/initStaticJsonRpcProvider";

const rpcList = filterRpcUrls(polygon, [
  "https://polygon.llamarpc.com",
  "https://endpoints.omniatech.io/v1/matic/mainnet/public",
  // "https://rpc-mainnet.maticvigil.com",
  "https://polygon-rpc.com",
]);

const viemConfig = {
  ...polygon,
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
const ethersProvider = await initStaticJsonRpcProvider(polygon.id);

export const polygonConfig = {
  publicClient,
  ethersProvider,
  viemConfig: viemConfig,
  chainId: polygon.id,
  chainName: "MATIC",
  symbol: "MATIC",
  icon: useImage("assets/images/networks/polygon-icon.svg"),
  baseTokenIcon: useImage("assets/images/tokens/MATIC.png"),
  baseTokenSymbol: "MATIC",
  networkIcon: useImage(`assets/images/networks/polygon.svg`),
  lzChainId: 109,
};
