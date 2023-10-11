import { useImage } from "@/helpers/useImage";
import { moonriver } from "@wagmi/core/chains";

export const moonriverConfig = {
  ...moonriver,
  symbol: "Moonriver",
  icon: useImage("assets/images/networks/moonriver.svg"),
  baseTokenIcon: useImage("assets/images/tokens/MOVR.png"),
  lzChainId: 167,
  switchData: {
    chainId: "0x505",
    chainName: "Moonriver",
    rpcUrls: ["https://rpc.api.moonriver.moonbeam.network"],
    blockExplorerUrls: ["https://moonriver.moonscan.io/"],
  },
};
