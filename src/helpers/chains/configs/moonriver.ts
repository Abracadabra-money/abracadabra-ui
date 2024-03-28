import { useImage } from "@/helpers/useImage";
import { moonriver } from "@wagmi/core/chains";
import { initPublicClient } from "@/helpers/chains/initPublicClient";

const http = [
  moonriver.rpcUrls.default.http[0],
  "https://moonriver-rpc.publicnode.com	",
  "https://rpc.api.moonriver.moonbeam.network",
  "https://moonriver.public.blastapi.io",
  "https://moonriver-rpc.dwellir.com",
];

const viemConfig = {
  ...moonriver,
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

export const moonriverConfig = {
  publicClient,
  viemConfig: viemConfig,
  chainId: moonriver.id,
  chainName: "Moonriver",
  symbol: "Moonriver",
  icon: useImage("assets/images/networks/moonriver.svg"),
  baseTokenIcon: useImage("assets/images/tokens/MOVR.png"),
  baseTokenSymbol: "MOVR",
  networkIcon: useImage(`assets/images/networks/moonriver.svg`),
  lzChainId: 167,
};
