import { kava } from "@wagmi/core/chains";
import { RPC_KAVA } from "@/constants/rpc";
import { useImage } from "@/helpers/useImage";
import { initPublicClient } from "@/helpers/chains/initPublicClient";

const http = [
  RPC_KAVA,
  kava.rpcUrls.default.http[0],
  "https://evm.kava.io",
  "https://rpc.ankr.com/kava_evm",
  "https://evm.kava.chainstacklabs.com",
];

const viemConfig = {
  ...kava,
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
