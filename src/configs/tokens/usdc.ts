export type UsdcConfig = {
  address: string;
  decimals: number;
};

export type ChainsUsdcConfigs = {
  1: UsdcConfig;
  10: UsdcConfig;
  56: UsdcConfig;
  137: UsdcConfig;
  250: UsdcConfig;
  2222: UsdcConfig;
  42161: UsdcConfig;
  43114: UsdcConfig;
};

export const chainsUsdcConfigs: ChainsUsdcConfigs = {
  1: {
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    decimals: 6,
  },
  10: {
    address: "0x7f5c764cbc14f9669b88837ca1490cca17c31607",
    decimals: 6,
  },
  56: {
    address: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d",
    decimals: 18,
  },
  137: {
    address: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
    decimals: 6,
  },
  250: {
    address: "0x04068da6c83afcfa0e13ba15a6696662335d5b75",
    decimals: 6,
  },
  2222: {
    address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    decimals: 6,
  },
  42161: {
    address: "0xff970a61a04b1ca14834a43f5de4533ebddb5cc8",
    decimals: 6,
  },
  43114: {
    address: "0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e",
    decimals: 6,
  },
};
