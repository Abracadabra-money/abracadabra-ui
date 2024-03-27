import { arbitrum } from "@wagmi/core/chains";
import { useImage } from "@/helpers/useImage";

export const arbitrumConfig = {
  ...arbitrum,
  rpcUrls: {
    public: {
      http: [
        arbitrum.rpcUrls.default.http[0],
        "https://arbitrum.llamarpc.com",
        "https://arbitrum-one.publicnode.com",
        "https://1rpc.io/arb",
        "https://arbitrum-one.public.blastapi.io",
      ],
    },
    default: {
      http: [
        arbitrum.rpcUrls.default.http[0],
        "https://arbitrum.llamarpc.com",
        "https://arbitrum-one.publicnode.com",
        "https://1rpc.io/arb",
        "https://arbitrum-one.public.blastapi.io",
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
