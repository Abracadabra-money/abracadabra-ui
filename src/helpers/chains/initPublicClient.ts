import { createPublicClient, fallback, http } from "viem";

export const initPublicClient: any = (chainConfig: any) => {
  const defaultRpc: string[] = chainConfig.rpcUrls.default.http;

  const transport = fallback(
    defaultRpc.map((rpc: string) => http(rpc)),
    {
      rank: {
        interval: 15000,
        sampleCount: 10,
        timeout: 500,
      },
      retryCount: 5,
      retryDelay: 1000,
    }
  );

  return createPublicClient({
    chain: chainConfig,
    transport: transport,
    batch: {
      multicall: true,
    },
  });
};
