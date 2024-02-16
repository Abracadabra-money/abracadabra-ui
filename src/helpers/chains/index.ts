import { mainnetConfig } from "@/helpers/chains/configs/mainnet";
import { optimismConfig } from "@/helpers/chains/configs/optimism";
import { binanceConfig } from "@/helpers/chains/configs/binance";
import { polygonConfig } from "@/helpers/chains/configs/polygon";
import { fantomConfig } from "@/helpers/chains/configs/fantom";
import { moonriverConfig } from "@/helpers/chains/configs/moonriver";
import { kavaConfig } from "@/helpers/chains/configs/kava";
import { baseConfig } from "@/helpers/chains/configs/base";
import { arbitrumConfig } from "@/helpers/chains/configs/arbitrum";
import { avalancheConfig } from "@/helpers/chains/configs/avalanche";
import { lineaConfig } from "@/helpers/chains/configs/linea";
import { berachainConfig } from "@/helpers/chains/configs/bera";

import {
  RPC_ETH,
  RPC_OPTIMISM,
  RPC_BSC,
  RPC_POLYGON,
  RPC_FTM,
  RPC_MOONRIVER,
  RPC_BASE,
  RPC_ARB,
  RPC_AVAX,
  RPC_KAVA,
  PRC_LINEA,
  RPC_BERRA_ARTIO
} from "@/constants/rpc";

export const chains = [
  mainnetConfig,
  arbitrumConfig,
  kavaConfig,
  avalancheConfig,
  optimismConfig,
  fantomConfig,
  binanceConfig,
  polygonConfig,
  moonriverConfig,
  baseConfig,
  lineaConfig,
  berachainConfig
];

export const chainsList = {
  1: mainnetConfig,
  10: optimismConfig,
  56: binanceConfig,
  137: polygonConfig,
  250: fantomConfig,
  1285: moonriverConfig,
  2222: kavaConfig,
  8453: baseConfig,
  42161: arbitrumConfig,
  43114: avalancheConfig,
  59144: lineaConfig,
  80085: berachainConfig
};

export const defaultRpc = {
  1: RPC_ETH,
  10: RPC_OPTIMISM,
  56: RPC_BSC,
  137: RPC_POLYGON,
  250: RPC_FTM,
  1285: RPC_MOONRIVER,
  8453: RPC_BASE,
  42161: RPC_ARB,
  43114: RPC_AVAX,
  2222: RPC_KAVA,
  59144: PRC_LINEA,
  80085: RPC_BERRA_ARTIO
};

export const getChainById = (chainId: number): Object =>
  chainsList[chainId as keyof typeof chainsList];

export const getChainRpc = (chainId: number): string =>
  chainsList[chainId as keyof typeof chainsList].rpcUrls.default.http[0];
