import { useImage } from "@/helpers/useImage";
import { avalanche } from "@wagmi/core/chains";

export const avalancheConfig = {
  ...avalanche,
  chainId: avalanche.id,
  symbol: "AVAX",
  icon: useImage("assets/images/networks/arbitrum-icon.svg"),
  baseTokenIcon: useImage("assets/images/tokens/AVAX.png"),
  lzChainId: 106,
};
