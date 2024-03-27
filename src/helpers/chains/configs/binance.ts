import { bsc } from "@wagmi/core/chains";
import { useImage } from "@/helpers/useImage";

export const binanceConfig = {
  ...bsc,
  rpcUrls: {
    public: {
      http: [
        "https://bsc-dataseed1.defibit.io",
        "https://bsc-dataseed2.defibit.io",
        "https://bsc-dataseed3.defibit.io",
        "https://bsc-dataseed4.defibit.io",
        "https://binance.llamarpc.com",
      ],
    },
    default: {
      http: [
        "https://bsc-dataseed1.defibit.io",
        "https://bsc-dataseed2.defibit.io",
        "https://bsc-dataseed3.defibit.io",
        "https://bsc-dataseed4.defibit.io",
        "https://binance.llamarpc.com",
      ],
    },
  },
  chainId: bsc.id,
  chainName: "BNB Chain",
  symbol: "BSC",
  icon: useImage("assets/images/networks/binance-icon.svg"),
  baseTokenIcon: useImage("assets/images/tokens/BNB.png"),
  baseTokenSymbol: "BNB",
  networkIcon: useImage(`assets/images/networks/binance.svg`),
  lzChainId: 102,
};
