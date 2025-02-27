import { useImage } from "@/helpers/useImage";
import { beraBartio } from "@/helpers/connect/configs/beraBartio";
import { initPublicClient } from "@/helpers/connect/initPublicClient";

const publicClient = initPublicClient(beraBartio.id);

export const beraBartioConfig = {
  publicClient,
  viemConfig: beraBartio,
  chainId: beraBartio.id,
  chainName: "Berachain Bartio",
  symbol: "BERA",
  icon: useImage("assets/images/networks/bera.png"),
  baseTokenIcon: useImage("assets/images/tokens/ETH.png"),
  baseTokenSymbol: "BERA",
  networkIcon: useImage(`assets/images/networks/bera.png`),
  //   lzChainId: 184,
};
