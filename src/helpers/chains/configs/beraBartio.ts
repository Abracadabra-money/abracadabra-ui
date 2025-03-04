import { useImage } from "@/helpers/useImage";
import { beraBartio } from "@/helpers/connect/configs/beraBartio";
import { getRpcListByChainId } from "@/helpers/chains/utils";
import { initPublicClient } from "@/helpers/chains/initPublicClient";

const rpcList = getRpcListByChainId(beraBartio.id);

const viemConfig = {
  ...beraBartio,
  rpcUrls: {
    public: {
      http: rpcList,
    },
    default: {
      http: rpcList,
    },
  },
};
const publicClient = initPublicClient(beraBartio);

export const beraBartioConfig = {
  viemConfig,
  publicClient,
  chainId: beraBartio.id,
  chainName: "Berachain Bartio",
  symbol: "BERA",
  icon: useImage("assets/images/networks/bera.png"),
  baseTokenIcon: useImage("assets/images/tokens/ETH.png"),
  baseTokenSymbol: "BERA",
  networkIcon: useImage(`assets/images/networks/bera.png`),
  //   lzChainId: 184,
};
