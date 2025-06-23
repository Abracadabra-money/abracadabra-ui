import { optimism } from "@wagmi/core/chains";
import { useImage } from "@/helpers/useImage";
import { getRpcListByChainId } from "@/helpers/chains/utils";
import { initPublicClient } from "@/helpers/chains/initPublicClient";
import type { Address } from "viem";
const rpcList = getRpcListByChainId(optimism.id);

const viemConfig = {
  ...optimism,
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

export const optimismConfig = {
  viemConfig,
  publicClient,
  chainId: optimism.id,
  chainName: "Optimism",
  symbol: "OP",
  icon: useImage("assets/images/networks/optimism-icon.svg"),
  baseTokenIcon: useImage("assets/images/tokens/ETH.png"),
  baseTokenSymbol: "ETH",
  wrappedNativeTokenAddress:
    "0x4200000000000000000000000000000000000006" as Address,
  networkIcon: useImage(`assets/images/networks/optimism.svg`),
  lzChainId: 111,
};
