import { fantom } from "@wagmi/core/chains";
import { useImage } from "@/helpers/useImage";
import { filterRpcUrls } from "@/helpers/chains/utils";
import { initPublicClient } from "@/helpers/chains/initPublicClient";

const rpcList = filterRpcUrls(fantom, [
  "https://1rpc.io/ftm",
  "https://fantom-rpc.publicnode.com",
  "https://rpcapi.fantom.network",
  "https://fantom-mainnet.public.blastapi.io",
]);

const viemConfig = {
  ...fantom,
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

export const fantomConfig = {
  publicClient,
  viemConfig: viemConfig,
  chainId: fantom.id,
  chainName: "Fantom",
  symbol: "FTM",
  icon: useImage("assets/images/networks/fantom-icon.svg"),
  baseTokenIcon: useImage("assets/images/tokens/FTM2.png"),
  baseTokenSymbol: "FTM",
  networkIcon: useImage(`assets/images/networks/fantom.svg`),
  lzChainId: 112,
};
