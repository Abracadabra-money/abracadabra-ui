import type { Address } from "viem";
import { useImage } from "@/helpers/useImage";
import { getRpcListByChainId } from "@/helpers/chains/utils";
import { initPublicClient } from "@/helpers/chains/initPublicClient";
import { BERA_BARTIO_CHAIN_ID } from "@/constants/global";

const rpcList = getRpcListByChainId(BERA_BARTIO_CHAIN_ID);

export const viemConfig = {
  blockExplorers: {
    etherscan: { name: "Berascan", url: "https://bartio.beratrail.io/" },
    default: { name: "Berascan", url: "https://bartio.beratrail.io/" },
  },
  contracts: {
    multicall3: {
      address: "0xcA11bde05977b3631167028862bE2a173976CA11" as Address,
      blockCreated: 5022,
    },
  },
  id: BERA_BARTIO_CHAIN_ID,
  name: "Berachain Bartio",

  nativeCurrency: { name: "Berachain Bartio", symbol: "BERA", decimals: 18 },
  rpcUrls: {
    public: {
      http: rpcList,
    },
    default: {
      http: rpcList,
    },
  },
};

const publicClient = initPublicClient(viemConfig);

export const beraBartioConfig = {
  viemConfig,
  publicClient,
  chainId: viemConfig.id,
  chainName: "Berachain Bartio",
  symbol: "BERA",
  icon: useImage("assets/images/networks/bera.png"),
  baseTokenIcon: useImage("assets/images/tokens/ETH.png"),
  baseTokenSymbol: "BERA",
  networkIcon: useImage(`assets/images/networks/bera.png`),
  //   lzChainId: 184,
};
