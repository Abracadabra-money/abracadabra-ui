import { useImage } from "@/helpers/useImage";
import { base } from "@wagmi/core/chains";
import { initPublicClient } from "@/helpers/chains/initPublicClient";

const http = [
  "https://base.llamarpc.com",
  base.rpcUrls.default.http[0],
  "https://base.drpc.org",
  "https://base-rpc.publicnode.com",
  "https://base.meowrpc.com",
];

const viemConfig = {
  ...base,
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

export const baseConfig = {
  publicClient,
  viemConfig: viemConfig,
  chainId: base.id,
  chainName: "BASE",
  symbol: "Base",
  icon: useImage("assets/images/networks/base.png"),
  baseTokenIcon: useImage("assets/images/tokens/ETH.png"),
  baseTokenSymbol: "ETH",
  networkIcon: useImage(`assets/images/networks/base.png`),
  lzChainId: 184,
};
