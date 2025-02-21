import type { Address } from "viem";
import { fallback, http } from "@wagmi/core";
import { BERA_BARTIO_CHAIN_ID } from "@/constants/global";

// todo update rpc list
export const beraBartioRpcList = ["https://bartio.rpc.berachain.com/"];

export const beraBartioTransport = fallback(
  beraBartioRpcList.map((url) => http(url))
);

export const beraBartio = {
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
      http: ["https://bartio.rpc.berachain.com/"],
    },
    default: {
      http: ["https://bartio.rpc.berachain.com/"],
    },
  },
};
