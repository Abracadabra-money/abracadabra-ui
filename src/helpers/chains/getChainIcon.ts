import { useImage } from "@/helpers/useImage";

// todo transfer to config
export const getChainIcon = (chainId: number): string => {
  switch (chainId) {
    case 1:
      return useImage("assets/images/chains/ethereum.svg");
    case 10:
      return useImage("assets/images/chains/optimism.svg");
    case 56:
      return useImage("assets/images/chains/bsc.svg");
    case 137:
      return useImage("assets/images/chains/poligon.svg");
    case 250:
      return useImage("assets/images/chains/fantom.svg");
    case 1285:
      return useImage("assets/images/chains/moonriver.svg");
    case 2222:
      return useImage("assets/images/chains/kava.svg");
    case 8453:
      return useImage("assets/images/chains/base.svg");
    case 42161:
      return useImage("assets/images/chains/arbitrum.svg");
    case 43114:
      return useImage("assets/images/chains/avalanche.svg");
    case 59144:
      return useImage("assets/images/chains/linea.svg");
    case 80085:
      return useImage("assets/images/networks/bera.png");
    case 168587773:
      return useImage("assets/images/networks/blast.png");
    case 81457:
      return useImage("assets/images/networks/blast.png");

    default:
      return useImage("assets/images/networks/unsupportedChain.svg");
  }
};
