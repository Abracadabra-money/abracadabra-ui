import type { Chain } from "viem";

const badRequestListRpc = [
  "https://mainnet.optimism.io",
  "https://mainnet.base.org",
];

export const filterRpcUrls = (config: Chain, rpcUrls: string[]) => {
  const { http } = config.rpcUrls.default || { http: [] };

  for (let i = 0; i < http.length; i++) {
    const defaultRpc = http[i];
    if (badRequestListRpc.includes(defaultRpc)) continue;
    rpcUrls.find((rpc) => rpc === defaultRpc) || rpcUrls.push(defaultRpc);
  }

  return rpcUrls;
};
