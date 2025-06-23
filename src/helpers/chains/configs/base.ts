import { base } from "@wagmi/core/chains";
import { useImage } from "@/helpers/useImage";
import { getRpcListByChainId } from "@/helpers/chains/utils";
import { initPublicClient } from "@/helpers/chains/initPublicClient";
import type { Address } from "viem";
const rpcList = getRpcListByChainId(base.id);

const viemConfig = {
  ...base,
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

export const baseConfig = {
  viemConfig,
  publicClient,
  chainId: base.id,
  chainName: "BASE",
  symbol: "Base",
  icon: useImage("assets/images/networks/base.png"),
  baseTokenIcon: useImage("assets/images/tokens/ETH.png"),
  baseTokenSymbol: "ETH",
  wrappedNativeTokenAddress:
    "0x4200000000000000000000000000000000000006" as Address,
  networkIcon: useImage(`assets/images/networks/base.png`),
  lzChainId: 184,
};
