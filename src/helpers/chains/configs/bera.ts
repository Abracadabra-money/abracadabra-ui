import { useImage } from "@/helpers/useImage";
import { beraChain } from "@/helpers/connect/configs/beraChain";
import { initPublicClient } from "@/helpers/connect/initPublicClient";

const publicClient = initPublicClient(beraChain.id);

export const beraConfig = {
  publicClient,
  viemConfig: beraChain,
  chainId: beraChain.id,
  chainName: "Berachain",
  symbol: "BERA",
  icon: useImage("assets/images/networks/bera.png"),
  baseTokenIcon: useImage("assets/images/tokens/BERA.png"),
  baseTokenSymbol: "BERA",
  networkIcon: useImage("assets/images/networks/bera.png"),
  //   lzChainId: 184,
};
