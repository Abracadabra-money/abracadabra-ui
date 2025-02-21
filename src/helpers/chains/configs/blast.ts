import { blast } from "@wagmi/core/chains";
import { useImage } from "@/helpers/useImage";

export const blastConfig = {
  viemConfig: blast,
  chainId: blast.id,
  chainName: "Blast",
  symbol: "Blast",
  icon: useImage("assets/images/networks/blast.png"),
  baseTokenIcon: useImage("assets/images/tokens/ETH.png"),
  baseTokenSymbol: "ETH",
  networkIcon: useImage(`assets/images/networks/blast.png`),
  lzChainId: 243,
};
