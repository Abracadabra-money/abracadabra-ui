import { useImage } from "@/helpers/useImage";

const tokens: any = {
  1: {
    symbol: "ETH",
    icon: useImage("assets/images/tokens/ETH.png"),
    scanUrl: "https://etherscan.io/tx/",
  },
  10: {
    symbol: "ETH",
    icon: useImage("assets/images/tokens/ETH.png"),
    scanUrl: "https://optimistic.etherscan.io/tx/",
  },
  56: {
    symbol: "BNB",
    icon: useImage("assets/images/tokens/BNB.png"),
    scanUrl: "https://bscscan.com/tx/",
  },
  137: {
    symbol: "MATIC",
    icon: useImage("assets/images/tokens/MATIC.png"),
    scanUrl: "https://polygonscan.com/tx/",
  },
  250: {
    symbol: "FTM",
    icon: useImage("assets/images/tokens/FTM.png"),
    scanUrl: "https://ftmscan.com/tx/",
  },
  1285: {
    symbol: "MOVR",
    icon: useImage("assets/images/tokens/MOVR.png"),
    scanUrl: "https://moonriver.moonscan.io/tx/",
  },
  2222: {
    symbol: "KAVA",
    icon: useImage("assets/images/tokens/KAVA.png"),
    scanUrl: "https://explorer.kava.io/tx/",
  },
  42161: {
    symbol: "ETH",
    icon: useImage("assets/images/tokens/ETH.png"),
    scanUrl: "https://arbiscan.io/tx/",
  },
  43114: {
    symbol: "AVAX",
    icon: useImage("assets/images/tokens/AVAX.png"),
    scanUrl: "https://snowtrace.io/tx/",
  },
  8453: {
    symbol: "ETH",
    icon: useImage("assets/images/tokens/ETH.png"),
    scanUrl: "https://basescan.org/tx/",
  },
};

export const getChainInfo = (chainId: number): Object => tokens[chainId];
