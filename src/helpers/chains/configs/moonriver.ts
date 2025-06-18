import { useImage } from "@/helpers/useImage";
import { moonriver } from "@wagmi/core/chains";
import { getRpcListByChainId } from "@/helpers/chains/utils";
import { initPublicClient } from "@/helpers/chains/initPublicClient";
import type { Address } from "viem";

const rpcList = getRpcListByChainId(moonriver.id);

const viemConfig = {
  ...moonriver,
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

export const moonriverConfig = {
  viemConfig,
  publicClient,
  chainId: moonriver.id,
  chainName: "Moonriver",
  symbol: "Moonriver",
  icon: useImage("assets/images/networks/moonriver.svg"),
  baseTokenIcon: useImage("assets/images/tokens/MOVR.png"),
  baseTokenSymbol: "MOVR",
  wrappedNativeTokenAddress:
    "0x98878B06940aE243284CA214f92Bb71a2b032B8A" as Address,
  networkIcon: useImage(`assets/images/networks/moonriver.svg`),
  lzChainId: 167,
};
