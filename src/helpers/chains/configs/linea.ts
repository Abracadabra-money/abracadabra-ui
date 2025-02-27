import { linea } from "@wagmi/core/chains";
import { useImage } from "@/helpers/useImage";
import { initPublicClient } from "@/helpers/connect/initPublicClient";

const publicClient = initPublicClient(linea.id);

export const lineaConfig = {
  publicClient,
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
