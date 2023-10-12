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

export const chains = [
  mainnetConfig,
  optimismConfig,
  binanceConfig,
  polygonConfig,
  fantomConfig,
  moonriverConfig,
  kavaConfig,
  baseConfig,
  arbitrumConfig,
  avalancheConfig,
  lineaConfig,
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
};

export const defaultRpc = {
  1: "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
  10: "https://mainnet.optimism.io",
  56: "https://bsc-dataseed.binance.org/",
  137: "https://polygon-rpc.com",
  250: "https://rpc.ftm.tools/",
  1285: "https://rpc.api.moonriver.moonbeam.network",
  8453: "https://mainnet.base.org",
  42161: "https://arb1.arbitrum.io/rpc",
  43114: "https://api.avax.network/ext/bc/C/rpc",
  2222: "https://evm.kava.io ",
  59144: "https://rpc.linea.build",
};
