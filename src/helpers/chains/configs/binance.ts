import { bsc } from "@wagmi/core/chains";
import { useImage } from "@/helpers/useImage";

export const binanceConfig = {
  ...bsc,
  chainId: bsc.id,
  symbol: "BSC",
  icon: useImage("assets/images/networks/binance-icon.svg"),
  baseTokenIcon: useImage("assets/images/tokens/BNB.png"),
  lzChainId: 102,
};
