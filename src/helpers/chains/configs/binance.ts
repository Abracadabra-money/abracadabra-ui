import { bsc } from "@wagmi/core/chains";
import { useImage } from "@/helpers/useImage";
import { initPublicClient } from "@/helpers/connect/initPublicClient";

const publicClient = initPublicClient(bsc.id);

export const binanceConfig = {
  publicClient,
  viemConfig: bsc,
  chainId: bsc.id,
  chainName: "BNB Chain",
  symbol: "BSC",
  icon: useImage("assets/images/networks/binance-icon.svg"),
  baseTokenIcon: useImage("assets/images/tokens/BNB.png"),
  baseTokenSymbol: "BNB",
  networkIcon: useImage(`assets/images/networks/binance.svg`),
  lzChainId: 102,
};
