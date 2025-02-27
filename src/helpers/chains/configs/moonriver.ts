import { useImage } from "@/helpers/useImage";
import { moonriver } from "@wagmi/core/chains";
import { initPublicClient } from "@/helpers/connect/initPublicClient";

const publicClient = initPublicClient(moonriver.id);

export const moonriverConfig = {
  publicClient,
  viemConfig: moonriver,
  chainId: moonriver.id,
  chainName: "Moonriver",
  symbol: "Moonriver",
  icon: useImage("assets/images/networks/moonriver.svg"),
  baseTokenIcon: useImage("assets/images/tokens/MOVR.png"),
  baseTokenSymbol: "MOVR",
  networkIcon: useImage(`assets/images/networks/moonriver.svg`),
  lzChainId: 167,
};
