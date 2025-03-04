import { polygon } from "@wagmi/core/chains";
import { useImage } from "@/helpers/useImage";
import { getRpcListByChainId } from "@/helpers/chains/utils";
import { initPublicClient } from "@/helpers/chains/initPublicClient";

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
const publicClient = initPublicClient(polygon);

export const polygonConfig = {
  viemConfig,
  publicClient,
  chainId: polygon.id,
  chainName: "MATIC",
  symbol: "MATIC",
  icon: useImage("assets/images/networks/polygon-icon.svg"),
  baseTokenIcon: useImage("assets/images/tokens/MATIC.png"),
  baseTokenSymbol: "MATIC",
  networkIcon: useImage(`assets/images/networks/polygon.svg`),
  lzChainId: 109,
};
