import { polygon } from "@wagmi/core/chains";
import { useImage } from "@/helpers/useImage";

export const polygonConfig = {
  ...polygon,
  chainId: polygon.id,
  chainName: "MATIC",
  symbol: "MATIC",
  icon: useImage("assets/images/networks/polygon-icon.svg"),
  baseTokenIcon: useImage("assets/images/tokens/MATIC.png"),
  baseTokenSymbol: "MATIC",
  networkIcon: useImage(`assets/images/networks/polygon.svg`),
  lzChainId: 109,
};
