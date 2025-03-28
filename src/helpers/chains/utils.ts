import type { Chain } from "viem";

const badRequestListRpc = [
  "https://mainnet.optimism.io",
  "https://mainnet.base.org",
  "https://arbitrum.llamarpc.com",
  "https://base.llamarpc.com",
  "https://binance.llamarpc.com",
  "https://eth.llamarpc.com",
  "https://optimism.llamarpc.com",
  "https://polygon.llamarpc.com",
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
