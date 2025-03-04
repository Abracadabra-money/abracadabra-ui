import type { Chain } from "viem";
import { createPublicClient } from "viem";
import { fallback, http } from "@wagmi/core";
import { getRpcListByChainId } from "@/helpers/connect/rpsList";

const rankKonfig = {
  rank: {
    interval: 15000,
    sampleCount: 10,
    timeout: 500,
  },
  retryCount: 5,
  retryDelay: 1000,
};

export const initPublicClient = (viemConfig: Chain) => {
  const defaultRpc = getRpcListByChainId(viemConfig.id);

  const transport = fallback(
    defaultRpc.map((rpc: string) => http(rpc)),
    {
      rank: false,
      retryCount: 0,
      retryDelay: 1000000,
    }
  );

  return createPublicClient({
    chain: viemConfig,
    transport: transport,
    batch: {
      multicall: true,
    },
  });
};
