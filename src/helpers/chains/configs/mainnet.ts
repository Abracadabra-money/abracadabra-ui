import { mainnet } from "@wagmi/core/chains";
import { useImage } from "@/helpers/useImage";
import { initPublicClient } from "@/helpers/connect/initPublicClient";

const publicClient = initPublicClient(mainnet.id);

export const mainnetConfig = {
  publicClient,
  viemConfig: mainnet,
  chainId: mainnet.id,
  chainName: "Ethereum",
  symbol: "ETH",
  icon: useImage("assets/images/networks/ethereum-icon.svg"),
  baseTokenIcon: useImage("assets/images/tokens/ETH.png"),
  baseTokenSymbol: "ETH",
  networkIcon: useImage(`assets/images/networks/ethereum.svg`),
  lzChainId: 101,
};
