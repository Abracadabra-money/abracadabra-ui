import { base } from "@wagmi/core/chains";
import { useImage } from "@/helpers/useImage";
import { filterRpcUrls } from "@/helpers/chains/utils";
import { initPublicClient } from "@/helpers/chains/initPublicClient";

const rpcList = filterRpcUrls(base, [
  "https://base.llamarpc.com",
  "https://base.drpc.org",
  "https://base-rpc.publicnode.com",
  "https://base.meowrpc.com",
]);

const viemConfig = {
  ...base,
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
