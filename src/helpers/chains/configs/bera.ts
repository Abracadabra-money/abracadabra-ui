import { useImage } from "@/helpers/useImage";
import { beraChain } from "@/helpers/connect/configs/beraChain";
import { getRpcListByChainId } from "@/helpers/chains/utils";
import { initPublicClient } from "@/helpers/chains/initPublicClient";

const rpcList = getRpcListByChainId(beraChain.id);

const viemConfig = {
  ...beraChain,
  rpcUrls: {
    public: {
      http: rpcList,
    },
    default: {
      http: rpcList,
    },
  },
};

const publicClient = initPublicClient(beraChain);

export const beraConfig = {
  viemConfig,
  publicClient,
  chainId: beraChain.id,
  chainName: "Berachain",
  symbol: "BERA",
  icon: useImage("assets/images/networks/bera.png"),
  baseTokenIcon: useImage("assets/images/tokens/BERA.png"),
  baseTokenSymbol: "BERA",
  networkIcon: useImage("assets/images/networks/bera.png"),
  //   lzChainId: 184,
};
