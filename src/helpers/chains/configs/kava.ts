import { kava } from "@wagmi/core/chains";
import { useImage } from "@/helpers/useImage";
import { getRpcListByChainId } from "@/helpers/chains/utils";
import { initPublicClient } from "@/helpers/chains/initPublicClient";
import type { Address } from "viem";
const rpcList = getRpcListByChainId(kava.id);

const viemConfig = {
  ...kava,
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

export const kavaConfig = {
  viemConfig,
  publicClient,
  chainId: kava.id,
  chainName: "KAVA",
  symbol: "Kava EVM",
  icon: useImage("assets/images/networks/kava.png"),
  baseTokenIcon: useImage("assets/images/tokens/KAVA.png"),
  baseTokenSymbol: "KAVA",
  wrappedNativeTokenAddress:
    "0xc86c7C0eFbd6A49B35E8714C5f59D99De09A225b" as Address,
  networkIcon: useImage(`assets/images/networks/kava.png`),
  lzChainId: 177,
};
