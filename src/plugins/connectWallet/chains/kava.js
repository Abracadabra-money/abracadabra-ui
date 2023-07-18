export const kava = {
  id: 2222,
  name: "Kava EVM",
  network: "Kava EVM",
  nativeCurrency: {
    decimals: 18,
    name: "Kava EVM",
    symbol: "Kava",
  },
  rpcUrls: {
    public: { http: ["https://evm.kava.io"] },
    default: { http: ["https://evm.kava.io"] },
  },
  blockExplorers: {
    etherscan: { name: "Kava", url: "https://explorer.kava.io" },
    default: { name: "Kava", url: "https://explorer.kava.io" },
  },
  contracts: {
    multicall3: {
      address: "0xcA11bde05977b3631167028862bE2a173976CA11",
      blockCreated: 3661165,
    },
  },
};
