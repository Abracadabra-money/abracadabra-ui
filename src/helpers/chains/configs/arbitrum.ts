import { arbitrum } from "@wagmi/core/chains";
import { useImage } from "@/helpers/useImage";

export const arbitrumConfig = {
  ...arbitrum,
  chainId: arbitrum.id,
  symbol: "AETH",
  icon: useImage("assets/images/networks/arbitrum-icon.svg"),
  baseTokenIcon: useImage("assets/images/tokens/ETH.png"),
  networkIcon: useImage(`assets/images/networks/arbitrum-chain.svg`),
  lzChainId: 110,
};
