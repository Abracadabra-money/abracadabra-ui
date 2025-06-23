import { blast } from "@wagmi/core/chains";
import { useImage } from "@/helpers/useImage";
import { getRpcListByChainId } from "@/helpers/chains/utils";
import { initPublicClient } from "@/helpers/chains/initPublicClient";
import type { Address } from "viem";

const rpcList = getRpcListByChainId(blast.id);

const viemConfig = {
  ...blast,
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

export const blastConfig = {
  viemConfig,
  publicClient,
  chainId: blast.id,
  chainName: "Blast",
  symbol: "Blast",
  icon: useImage("assets/images/networks/blast.png"),
  baseTokenIcon: useImage("assets/images/tokens/ETH.png"),
  baseTokenSymbol: "ETH",
  wrappedNativeTokenAddress:
    "0x4300000000000000000000000000000000000004" as Address,
  networkIcon: useImage(`assets/images/networks/blast.png`),
  lzChainId: 243,
};
