import { bsc } from "@wagmi/core/chains";
import { useImage } from "@/helpers/useImage";
import { getRpcListByChainId } from "@/helpers/chains/utils";
import { initPublicClient } from "@/helpers/chains/initPublicClient";
import type { Address } from "viem";

const rpcList = getRpcListByChainId(bsc.id);

const viemConfig = {
  ...bsc,
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

export const binanceConfig = {
  viemConfig,
  publicClient,
  chainId: bsc.id,
  chainName: "BNB Chain",
  symbol: "BSC",
  icon: useImage("assets/images/networks/binance-icon.svg"),
  baseTokenIcon: useImage("assets/images/tokens/BNB.png"),
  baseTokenSymbol: "BNB",
  wrappedNativeTokenAddress:
    "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c" as Address,
  networkIcon: useImage(`assets/images/networks/binance.svg`),
  lzChainId: 102,
};
