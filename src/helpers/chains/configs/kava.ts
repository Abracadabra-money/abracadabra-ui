import { kava } from "@wagmi/core/chains";
import { useImage } from "@/helpers/useImage";

export const kavaConfig = {
  viemConfig: kava,
  chainId: kava.id,
  chainName: "KAVA",
  symbol: "Kava EVM",
  icon: useImage("assets/images/networks/kava.png"),
  baseTokenIcon: useImage("assets/images/tokens/KAVA.png"),
  baseTokenSymbol: "Kava",
  networkIcon: useImage(`assets/images/networks/kava.png`),
  lzChainId: 177,
};
