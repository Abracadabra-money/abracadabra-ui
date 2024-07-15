import { arbitrum } from "@wagmi/core/chains";
import { useImage } from "@/helpers/useImage";
import { filterRpcUrls } from "@/helpers/chains/utils";
import { initPublicClient } from "@/helpers/chains/initPublicClient";
import { initStaticJsonRpcProvider } from "@/helpers/chains/initStaticJsonRpcProvider";

const rpcList = filterRpcUrls(arbitrum, [
  "https://arbitrum.llamarpc.com",
  "https://1rpc.io/arb",
  "https://arbitrum-one.public.blastapi.io",
  "https://arbitrum.meowrpc.com",
]);

const viiemConfig = {
  ...arbitrum,
  rpcUrls: {
    public: {
      http: rpcList,
    },
    default: {
      http: rpcList,
    },
  },
};

const publicClient = initPublicClient(viiemConfig);
const ethersProvider = await initStaticJsonRpcProvider(arbitrum.id);

export const arbitrumConfig = {
  publicClient,
  ethersProvider,
  viemConfig: viiemConfig,
  chainId: arbitrum.id,
  chainName: "Arbitrum",
  symbol: "AETH",
  icon: useImage("assets/images/networks/arbitrum-icon.svg"),
  baseTokenIcon: useImage("assets/images/tokens/ETH.png"),
  baseTokenSymbol: "ETH",
  networkIcon: useImage(`assets/images/networks/arbitrum-chain.svg`),
  lzChainId: 110,
};
