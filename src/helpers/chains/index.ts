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
import { blastSepoliaConfig } from "@/helpers/chains/configs/blastSepolia";
import { blastConfig } from "@/helpers/chains/configs/blast";

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
  RPC_BERRA_ARTIO,
  RPC_BLAST_SEPOLIA,
  RPC_BLAST,
} from "@/constants/rpc";

export const chains = [
  mainnetConfig.viemConfig,
  arbitrumConfig.viemConfig,
  blastConfig,
  kavaConfig.viemConfig,
  avalancheConfig.viemConfig,
  optimismConfig.viemConfig,
  fantomConfig.viemConfig,
  binanceConfig.viemConfig,
  polygonConfig.viemConfig,
  moonriverConfig.viemConfig,
  baseConfig.viemConfig,
  lineaConfig,
  berachainConfig,
  blastSepoliaConfig,
];

export const chainsList = {
  1: mainnetConfig.viemConfig,
  10: optimismConfig.viemConfig,
  56: binanceConfig.viemConfig,
  137: polygonConfig.viemConfig,
  250: fantomConfig.viemConfig,
  1285: moonriverConfig.viemConfig,
  2222: kavaConfig.viemConfig,
  8453: baseConfig.viemConfig,
  42161: arbitrumConfig.viemConfig,
  43114: avalancheConfig.viemConfig,
  59144: lineaConfig,
  80085: berachainConfig,
  81457: blastConfig,
  168587773: blastSepoliaConfig,
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
  80085: RPC_BERRA_ARTIO,
  81457: RPC_BLAST,
  168587773: RPC_BLAST_SEPOLIA,
};

export const getChainById = (chainId: number): Object =>
  chainsList[chainId as keyof typeof chainsList];

export const getRpcByChainId = (chainId: number): string =>
  defaultRpc[chainId as keyof typeof defaultRpc];
