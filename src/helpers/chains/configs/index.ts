import { arbitrumConfig } from "@/helpers/chains/configs/arbitrum";
import { avalancheConfig } from "@/helpers/chains/configs/avalanche";
import { baseConfig } from "@/helpers/chains/configs/base";
import { berachainConfig } from "@/helpers/chains/configs/bera";
import { binanceConfig } from "@/helpers/chains/configs/binance";
import { blastConfig } from "@/helpers/chains/configs/blast";
import { fantomConfig } from "@/helpers/chains/configs/fantom";
import { kavaConfig } from "@/helpers/chains/configs/kava";
import { lineaConfig } from "@/helpers/chains/configs/linea";
import { mainnetConfig } from "@/helpers/chains/configs/mainnet";
import { moonriverConfig } from "@/helpers/chains/configs/moonriver";
import { optimismConfig } from "@/helpers/chains/configs/optimism";
import { polygonConfig } from "@/helpers/chains/configs/polygon";

export const chainsConfigs = [
  mainnetConfig,
  arbitrumConfig,
  blastConfig,
  kavaConfig,
  avalancheConfig,
  optimismConfig,
  fantomConfig,
  binanceConfig,
  polygonConfig,
  moonriverConfig,
  baseConfig,
  lineaConfig,
  berachainConfig,
];
