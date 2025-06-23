import { polygon } from "@wagmi/core/chains";
import { useImage } from "@/helpers/useImage";
import { getRpcListByChainId } from "@/helpers/chains/utils";
import { initPublicClient } from "@/helpers/chains/initPublicClient";
import type { Address } from "viem";

const rpcList = getRpcListByChainId(polygon.id);

const viemConfig = {
  ...polygon,
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

export const polygonConfig = {
  viemConfig,
  publicClient,
  chainId: polygon.id,
  chainName: "MATIC",
  symbol: "MATIC",
  icon: useImage("assets/images/networks/polygon-icon.svg"),
  baseTokenIcon: useImage("assets/images/tokens/MATIC.png"),
  baseTokenSymbol: "MATIC",
  wrappedNativeTokenAddress:
    "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270" as Address,
  networkIcon: useImage(`assets/images/networks/polygon.svg`),
  lzChainId: 109,
};
