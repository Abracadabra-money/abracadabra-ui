import { bsc } from "@wagmi/core/chains";
import { useImage } from "@/helpers/useImage";

export const binanceConfig = {
  ...bsc,
  symbol: "BSC",
  icon: useImage("assets/images/networks/binance-icon.svg"),
  baseTokenIcon: useImage("assets/images/tokens/BNB.png"),
  lzChainId: 102,
  switchData: {
    chainId: "0x38",
    chainName: "Binance Smart Chain",
    nativeCurrency: {
      name: "BNB",
      symbol: "BNB",
      decimals: 18,
    },
    rpcUrls: [
      "https://bsc-dataseed.binance.org/",
      "https://bsc-dataseed1.defibit.io/",
      "https://bsc-dataseed1.ninicoin.io/",
    ],
    blockExplorerUrls: ["https://bscscan.com"],
    iconUrls: [
      "https://s2.coinmarketcap.com/static/img/coins/200x200/1839.png",
    ],
  },
};
