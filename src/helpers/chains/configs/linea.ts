import { linea } from "@wagmi/core/chains";
import { useImage } from "@/helpers/useImage";
import { getRpcListByChainId } from "@/helpers/chains/utils";
import { initPublicClient } from "@/helpers/chains/initPublicClient";
import type { Address } from "viem";

const rpcList = getRpcListByChainId(linea.id);

const viemConfig = {
  ...linea,
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

export const lineaConfig = {
  viemConfig,
  publicClient,
  chainId: linea.id,
  chainName: "Linea",
  symbol: "Linea",
  icon: useImage("assets/images/networks/linea.png"),
  baseTokenIcon: useImage("assets/images/tokens/ETH.png"),
  baseTokenSymbol: "ETH",
  wrappedNativeTokenAddress:
    "0xe5D7C2a44FfDDf6b295A15c148167daaAf5Cf34f" as Address,
  networkIcon: useImage(`assets/images/networks/linea.png`),
  lzChainId: 183,
};
