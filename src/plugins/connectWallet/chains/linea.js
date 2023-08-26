export const linea = {
  id: 59144,
  name: "Linea",
  network: "Linea Mainnet",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    public: { http: ["https://rpc.linea.build"] },
    default: { http: ["https://rpc.linea.build"] },
  },
  blockExplorers: {
    etherscan: {
      name: "Lineascan",
      url: "https://lineascan.build/",
    },
    default: {
      name: "Lineascan",
      url: "https://lineascan.build/",
    },
  },
  contracts: {
    multicall3: {
      address: "0xcA11bde05977b3631167028862bE2a173976CA11",
      blockCreated: 498623,
    },
  },
};
