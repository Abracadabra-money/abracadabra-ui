import { fantom } from "@wagmi/core/chains";
import { useImage } from "@/helpers/useImage";
import { getRpcListByChainId } from "@/helpers/chains/utils";
import { initPublicClient } from "@/helpers/chains/initPublicClient";

const rpcList = getRpcListByChainId(fantom.id);

const viemConfig = {
  ...fantom,
  rpcUrls: {
    public: {
      http: rpcList,
    },
    default: {
      http: rpcList,
    },
  },
};
const publicClient = initPublicClient(fantom);

export const fantomConfig = {
  viemConfig,
  publicClient,
  chainId: fantom.id,
  chainName: "Fantom",
  symbol: "FTM",
  icon: useImage("assets/images/networks/fantom-icon.svg"),
  baseTokenIcon: useImage("assets/images/tokens/FTM2.png"),
  baseTokenSymbol: "FTM",
  networkIcon: useImage(`assets/images/networks/fantom.svg`),
  lzChainId: 112,
};
