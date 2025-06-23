import { useImage } from "@/helpers/useImage";
import { avalanche } from "@wagmi/core/chains";
import { getRpcListByChainId } from "@/helpers/chains/utils";
import { initPublicClient } from "@/helpers/chains/initPublicClient";
import type { Address } from "viem";

const rpcList = getRpcListByChainId(avalanche.id);

const viemConfig = {
  ...avalanche,
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

export const avalancheConfig = {
  viemConfig,
  publicClient,
  chainId: avalanche.id,
  chainName: "Avalanche",
  symbol: "AVAX",
  icon: useImage("assets/images/networks/avalanche.svg"),
  baseTokenIcon: useImage("assets/images/tokens/AVAX.png"),
  baseTokenSymbol: "AVAX",
  wrappedNativeTokenAddress:
    "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7" as Address,
  networkIcon: useImage(`assets/images/networks/avalanche.svg`),
  lzChainId: 106,
};
