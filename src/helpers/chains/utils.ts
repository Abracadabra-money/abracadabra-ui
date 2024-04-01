import type { Chain } from "viem";

export const filterRpcUrls = (config: Chain, rpcUrls: string[]) => {
  const { http } = config.rpcUrls.default || { http: [] };

  for (let i = 0; i < http.length; i++) {
    const defaultRpc = http[i];
    rpcUrls.find((rpc) => rpc === defaultRpc) || rpcUrls.push(defaultRpc);
  }

  return rpcUrls;
};
