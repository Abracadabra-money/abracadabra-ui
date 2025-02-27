import { base } from "@wagmi/core/chains";
import { useImage } from "@/helpers/useImage";
import { initPublicClient } from "@/helpers/connect/initPublicClient";

const publicClient = initPublicClient(base.id);

export const baseConfig = {
  publicClient,
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
