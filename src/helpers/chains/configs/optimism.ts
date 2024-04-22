import { optimism } from "@wagmi/core/chains";
import { useImage } from "@/helpers/useImage";
import { filterRpcUrls } from "@/helpers/chains/utils";
import { initPublicClient } from "@/helpers/chains/initPublicClient";
import { initStaticJsonRpcProvider } from "@/helpers/chains/initStaticJsonRpcProvider";

const rpcList = filterRpcUrls(optimism, [
  "https://optimism.llamarpc.com",
  "https://optimism-mainnet.public.blastapi.io",
  "https://rpc.ankr.com/optimism",
  "https://1rpc.io/op",
]);

const viemConfig = {
  ...optimism,
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
const ethersProvider = await initStaticJsonRpcProvider(optimism.id);

export const optimismConfig = {
  publicClient,
  ethersProvider,
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
