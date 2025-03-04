import { useImage } from "@/helpers/useImage";
import { berachain } from "@wagmi/core/chains";
import { getRpcListByChainId } from "@/helpers/chains/utils";
import { initPublicClient } from "@/helpers/chains/initPublicClient";

const rpcList = getRpcListByChainId(berachain.id);

const viemConfig = {
  ...berachain,
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

export const beraConfig = {
  viemConfig,
  publicClient,
  chainId: berachain.id,
  chainName: "Berachain",
  symbol: "BERA",
  icon: useImage("assets/images/networks/bera.png"),
  baseTokenIcon: useImage("assets/images/tokens/BERA.png"),
  baseTokenSymbol: "BERA",
  networkIcon: useImage("assets/images/networks/bera.png"),
  //   lzChainId: 184,
};
