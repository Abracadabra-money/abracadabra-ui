import { fantom } from "@wagmi/core/chains";
import { useImage } from "@/helpers/useImage";
import { initPublicClient } from "@/helpers/connect/initPublicClient";

const publicClient = initPublicClient(fantom.id);

export const fantomConfig = {
  publicClient,
  viemConfig: fantom,
  chainId: fantom.id,
  chainName: "Fantom",
  symbol: "FTM",
  icon: useImage("assets/images/networks/fantom-icon.svg"),
  baseTokenIcon: useImage("assets/images/tokens/FTM2.png"),
  baseTokenSymbol: "FTM",
  networkIcon: useImage(`assets/images/networks/fantom.svg`),
  lzChainId: 112,
};
