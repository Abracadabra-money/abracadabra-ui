import { useImage } from "./useImage";

const tokens: any = {
  1: { symbol: "ETH", icon: useImage("assets/images/tokens/ETH.png") },
  10: { symbol: "ETH", icon: useImage("assets/images/tokens/ETH.png") },
  56: { symbol: "BNB", icon: useImage("assets/images/tokens/BNB.png") },
  137: { symbol: "MATIC", icon: useImage("assets/images/tokens/MATIC.png") },
  250: { symbol: "FTM", icon: useImage("assets/images/tokens/FTM.png") },
  1285: { symbol: "MOVR", icon: useImage("assets/images/tokens/MOVR.png") },
  42161: { symbol: "ETH", icon: useImage("assets/images/tokens/ETH.png") },
  43114: { symbol: "AVAX", icon: useImage("assets/images/tokens/AVAX.png") },
};

export const getTokenInfo = (chainId: number) => tokens[chainId];
