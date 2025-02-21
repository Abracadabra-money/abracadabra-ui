import { base } from "@wagmi/core/chains";
import { useImage } from "@/helpers/useImage";

export const baseConfig = {
  viemConfig: base,
  chainId: base.id,
  chainName: "BASE",
  symbol: "Base",
  icon: useImage("assets/images/networks/base.png"),
  baseTokenIcon: useImage("assets/images/tokens/ETH.png"),
  baseTokenSymbol: "ETH",
  networkIcon: useImage(`assets/images/networks/base.png`),
  lzChainId: 184,
};
