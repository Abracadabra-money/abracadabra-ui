import { useImage } from "@/helpers/useImage";
import { avalanche } from "@wagmi/core/chains";
import { initPublicClient } from "@/helpers/connect/initPublicClient";

const publicClient = initPublicClient(avalanche.id);

export const avalancheConfig = {
  publicClient,
  viemConfig: avalanche,
  chainId: avalanche.id,
  chainName: "Avalanche",
  symbol: "AVAX",
  icon: useImage("assets/images/networks/avalanche.svg"),
  baseTokenIcon: useImage("assets/images/tokens/AVAX.png"),
  baseTokenSymbol: "AVAX",
  networkIcon: useImage(`assets/images/networks/avalanche.svg`),
  lzChainId: 106,
};
