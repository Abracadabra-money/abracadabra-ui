import { linea } from "@wagmi/core/chains";
import { useImage } from "@/helpers/useImage";

export const lineaConfig = {
  viemConfig: linea,
  chainId: linea.id,
  chainName: "Linea",
  symbol: "Linea",
  icon: useImage("assets/images/networks/linea.png"),
  baseTokenIcon: useImage("assets/images/tokens/ETH.png"),
  baseTokenSymbol: "ETH",
  networkIcon: useImage(`assets/images/networks/linea.png`),
  lzChainId: 183,
};
