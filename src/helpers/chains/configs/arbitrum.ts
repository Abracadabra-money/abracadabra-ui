import { arbitrum } from "@wagmi/core/chains";
import { useImage } from "@/helpers/useImage";
import { initPublicClient } from "@/helpers/connect/initPublicClient";

const publicClient = initPublicClient(arbitrum.id);

export const arbitrumConfig = {
  publicClient,
  viemConfig: arbitrum,
  chainId: arbitrum.id,
  chainName: "Arbitrum",
  symbol: "AETH",
  icon: useImage("assets/images/networks/arbitrum-icon.svg"),
  baseTokenIcon: useImage("assets/images/tokens/ETH.png"),
  baseTokenSymbol: "ETH",
  networkIcon: useImage(`assets/images/networks/arbitrum-chain.svg`),
  lzChainId: 110,
};
