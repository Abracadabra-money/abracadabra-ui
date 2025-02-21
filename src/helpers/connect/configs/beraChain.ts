import type { Address } from "viem";
import { fallback, http } from "@wagmi/core";
import { BERA_CHAIN_ID } from "@/constants/global";

const beraRpcList = ["https://rpc.berachain.com"];

export const beraChainTransport = fallback(beraRpcList.map((url) => http(url)));

export const beraChain = {
  blockExplorers: {
    etherscan: { name: "Berascan", url: "https://berascan.com/" },
    default: { name: "Berascan", url: "https://berascan.com/" },
  },
  contracts: {
    multicall3: {
      address: "0xcA11bde05977b3631167028862bE2a173976CA11" as Address,
      blockCreated: 0,
    },
  },
  id: BERA_CHAIN_ID,
  name: "Berachain Bartio",
  nativeCurrency: { name: "Berachain", symbol: "BERA", decimals: 18 },
  rpcUrls: {
    public: {
      http: ["https://rpc.berachain.com"],
    },
    default: {
      http: ["https://rpc.berachain.com"],
    },
  },
};
