import { arbitrum } from "@wagmi/core/chains";
import { useImage } from "@/helpers/useImage";

export const arbitrumConfig = {
  ...arbitrum,
  rpcUrls: {
    public: {
      http: [
        "https://arbitrum-one.publicnode.com",
        "https://arbitrum.llamarpc.com",
        "https://rpc.ankr.com/arbitrum",
        "https://arbitrum-one.publicnode.com",
        "https://arbitrum.meowrpc.com",
      ],
    },
    default: {
      http: [
        "https://arbitrum-one.publicnode.com",
        "https://arbitrum.llamarpc.com",
        "https://rpc.ankr.com/arbitrum",
        "https://arbitrum-one.publicnode.com",
        "https://arbitrum.meowrpc.com",
      ],
    },
  },
  chainId: arbitrum.id,
  chainName: "Arbitrum",
  symbol: "AETH",
  icon: useImage("assets/images/networks/arbitrum-icon.svg"),
  baseTokenIcon: useImage("assets/images/tokens/ETH.png"),
  baseTokenSymbol: "ETH",
  networkIcon: useImage(`assets/images/networks/arbitrum-chain.svg`),
  lzChainId: 110,
};
