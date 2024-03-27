import { useImage } from "@/helpers/useImage";
import { base } from "@wagmi/core/chains";

export const baseConfig = {
  ...base,
  rpcUrls: {
    public: {
      http: [
        base.rpcUrls.default.http[0],
        "https://base.llamarpc.com",
        "https://base.drpc.org",
        "https://base-rpc.publicnode.com",
        "https://base.meowrpc.com",
      ],
    },
    default: {
      http: [
        base.rpcUrls.default.http[0],
        "https://base.llamarpc.com",
        "https://base.drpc.org",
        "https://base-rpc.publicnode.com",
        "https://base.meowrpc.com",
      ],
    },
  },
  chainId: 8453,
  chainName: "BASE",
  symbol: "Base",
  icon: useImage("assets/images/networks/base.png"),
  baseTokenIcon: useImage("assets/images/tokens/ETH.png"),
  baseTokenSymbol: "ETH",
  networkIcon: useImage(`assets/images/networks/base.png`),
  lzChainId: 184,
};
