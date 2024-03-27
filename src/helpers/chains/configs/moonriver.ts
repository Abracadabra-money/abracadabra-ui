import { useImage } from "@/helpers/useImage";
import { moonriver } from "@wagmi/core/chains";

export const moonriverConfig = {
  ...moonriver,
  rpcUrls: {
    public: {
      http: [
        moonriver.rpcUrls.default.http[0],
        "https://moonriver-rpc.publicnode.com	",
        "https://moonriver.api.onfinality.io/ublic",
        "https://moonriver.public.blastapi.io",
        "https://moonriver-rpc.dwellir.com",
      ],
    },
    default: {
      http: [
        moonriver.rpcUrls.default.http[0],
        "https://moonriver-rpc.publicnode.com	",
        "https://moonriver.api.onfinality.io/ublic",
        "https://moonriver.public.blastapi.io",
        "https://moonriver-rpc.dwellir.com",
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
