import { optimism } from "@wagmi/core/chains";
import { useImage } from "@/helpers/useImage";

export const optimismConfig = {
  ...optimism,
  chainId: optimism.id,
  symbol: "OP",
  icon: useImage("assets/images/networks/optimism-icon.svg"),
  baseTokenIcon: useImage("assets/images/tokens/ETH.png"),
  lzChainId: 111,
};
