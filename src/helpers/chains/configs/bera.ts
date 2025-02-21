import { useImage } from "@/helpers/useImage";
import { beraChain } from "@/helpers/connect/configs/beraChain";

export const beraConfig = {
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
