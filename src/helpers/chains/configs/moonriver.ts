import { useImage } from "@/helpers/useImage";
import { moonriver } from "@wagmi/core/chains";

export const moonriverConfig = {
  ...moonriver,
  rpcUrls: {
    public: {
      http: [
        "https://moonriver-rpc.publicnode.com",
        "https://moonriver.drpc.org",
        "https://moonriver-rpc.dwellir.com",
        "https://moonriver.public.blastapi.io",
        "https://rpc.api.moonriver.moonbeam.network",
      ],
    },
    default: {
      http: [
        "https://moonriver-rpc.publicnode.com",
        "https://moonriver.drpc.org",
        "https://moonriver-rpc.dwellir.com",
        "https://moonriver.public.blastapi.io",
        "https://rpc.api.moonriver.moonbeam.network",
      ],
    },
  },
  chainId: moonriver.id,
  chainName: "Moonriver",
  symbol: "Moonriver",
  icon: useImage("assets/images/networks/moonriver.svg"),
  baseTokenIcon: useImage("assets/images/tokens/MOVR.png"),
  baseTokenSymbol: "MOVR",
  networkIcon: useImage(`assets/images/networks/moonriver.svg`),
  lzChainId: 167,
};
