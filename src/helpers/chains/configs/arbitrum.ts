import { arbitrum } from "@wagmi/core/chains";
import { useImage } from "@/helpers/useImage";
import { filterRpcUrls } from "@/helpers/chains/utils";
import { initPublicClient } from "@/helpers/chains/initPublicClient";

const rpcList = filterRpcUrls(arbitrum, [
  "https://arbitrum.llamarpc.com",
  "https://arbitrum-one.publicnode.com",
  "https://1rpc.io/arb",
  "https://arbitrum-one.public.blastapi.io",
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

export const arbitrumConfig = {
  publicClient,
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
