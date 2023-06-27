export const RPC_MAINNET: string =
  "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161";
export const RPC_OPTIMISM: string = "https://mainnet.optimism.io";
export const RPC_BINANCE: string = "https://bsc-dataseed.binance.org/";
export const RPC_POLYGON: string = "https://polygon-rpc.com";
export const RPC_FANTOM: string = "https://rpc.ftm.tools/";
export const RPC_MOONRIVER: string =
  "https://rpc.api.moonriver.moonbeam.network";
export const RPC_ARBITRUM: string = "https://arb1.arbitrum.io/rpc";
export const RPC_AVALANCHE: string = "https://api.avax.network/ext/bc/C/rpc";

export const RPC: Object = {
  1: RPC_MAINNET,
  10: RPC_OPTIMISM,
  56: RPC_BINANCE,
  137: RPC_POLYGON,
  250: RPC_FANTOM,
  1285: RPC_MOONRIVER,
  42161: RPC_ARBITRUM,
  43114: RPC_AVALANCHE,
};
