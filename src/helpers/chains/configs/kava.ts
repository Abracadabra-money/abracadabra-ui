import { kava } from "@wagmi/core/chains";
import { useImage } from "@/helpers/useImage";
import { filterRpcUrls } from "@/helpers/chains/utils";
import { initPublicClient } from "@/helpers/chains/initPublicClient";

const rpcList = filterRpcUrls(kava, [
  "https://evm.kava-rpc.com",
  "https://kava-evm.publicnode.com",
  "https://evm.kava.io",
  "https://rpc.ankr.com/kava_evm",
  "https://evm.kava.chainstacklabs.com",
]);

const viemConfig = {
  ...kava,
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

export const kavaConfig = {
  publicClient,
  viemConfig: viemConfig,
  chainId: kava.id,
  chainName: "KAVA",
  symbol: "Kava EVM",
  icon: useImage("assets/images/networks/kava.png"),
  baseTokenIcon: useImage("assets/images/tokens/KAVA.png"),
  baseTokenSymbol: "Kava",
  networkIcon: useImage(`assets/images/networks/kava.png`),
  lzChainId: 177,
};
