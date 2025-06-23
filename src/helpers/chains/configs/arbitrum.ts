import { arbitrum } from "@wagmi/core/chains";
import { useImage } from "@/helpers/useImage";
import { getRpcListByChainId } from "@/helpers/chains/utils";
import { initPublicClient } from "@/helpers/chains/initPublicClient";
import type { Address } from "viem";

const rpcList = getRpcListByChainId(arbitrum.id);

const viemConfig = {
  ...arbitrum,
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

export const arbitrumConfig = {
  viemConfig,
  publicClient,
  chainId: arbitrum.id,
  chainName: "Arbitrum",
  symbol: "AETH",
  icon: useImage("assets/images/networks/arbitrum-icon.svg"),
  baseTokenIcon: useImage("assets/images/tokens/ETH.png"),
  baseTokenSymbol: "ETH",
  wrappedNativeTokenAddress:
    "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1" as Address,
  networkIcon: useImage(`assets/images/networks/arbitrum-chain.svg`),
  lzChainId: 110,
};
