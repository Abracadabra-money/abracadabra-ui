import { useImage } from "@/helpers/useImage";
import { moonriver } from "@wagmi/core/chains";

export const moonriverConfig = {
  ...moonriver,
  chainId: moonriver.id,
  chainName: "Moonriver",
  symbol: "Moonriver",
  icon: useImage("assets/images/networks/moonriver.svg"),
  baseTokenIcon: useImage("assets/images/tokens/MOVR.png"),
  baseTokenSymbol: "MOVR",
  networkIcon: useImage(`assets/images/networks/moonriver.svg`),
  lzChainId: 167,
};
