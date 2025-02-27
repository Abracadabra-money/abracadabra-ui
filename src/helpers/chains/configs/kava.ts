import { kava } from "@wagmi/core/chains";
import { useImage } from "@/helpers/useImage";
import { initPublicClient } from "@/helpers/connect/initPublicClient";

const publicClient = initPublicClient(kava.id);

export const kavaConfig = {
  publicClient,
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
