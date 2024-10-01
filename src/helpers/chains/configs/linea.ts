import { linea } from "@wagmi/core/chains";
import { useImage } from "@/helpers/useImage";
import { filterRpcUrls } from "@/helpers/chains/utils";
import { initPublicClient } from "@/helpers/chains/initPublicClient";
import { initStaticJsonRpcProvider } from "@/helpers/chains/initStaticJsonRpcProvider";

const rpcList = filterRpcUrls(linea, [
  "https://linea-rpc.publicnode.com",
  "https://rpc.linea.build",
  "https://linea.decubate.com",
  "https://linea.drpc.org",
  "https://1rpc.io/linea",
  "https://linea.blockpi.network/v1/rpc/public",
]);

const viemConfig = {
  ...linea,
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
const ethersProvider = await initStaticJsonRpcProvider(linea.id);

export const lineaConfig = {
  publicClient,
  ethersProvider,
  viemConfig: viemConfig,
  chainId: linea.id,
  chainName: "Linea",
  symbol: "Linea",
  icon: useImage("assets/images/networks/linea.png"),
  baseTokenIcon: useImage("assets/images/tokens/ETH.png"),
  baseTokenSymbol: "ETH",
  networkIcon: useImage(`assets/images/networks/linea.png`),
  lzChainId: 183,
};
