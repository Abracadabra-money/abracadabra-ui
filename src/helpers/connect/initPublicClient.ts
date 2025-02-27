import { createPublicClient } from "viem";
import { fallback, http } from "@wagmi/core";
import { getConfigByChainId } from "@/helpers/connect/configs";
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

export const initPublicClient = (chainId: number) => {
  const defaultRpc = getRpcListByChainId(chainId);
  const wagmiConfig = getConfigByChainId(chainId);

  const transport = fallback(
    defaultRpc.map((rpc: string) => http(rpc)),
    {
      rank: false,
      retryCount: 0,
      retryDelay: 1000000,
    }
  );

  return createPublicClient({
    chain: wagmiConfig,
    transport: transport,
    batch: {
      multicall: true,
    },
  });
};
