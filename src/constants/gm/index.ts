import { expandDecimals } from "@/helpers/gm/fee/expandDecials";
import type { Address } from "viem";

export const ORDER_AGENT: Address =
  "0x2d9b2DeB9767Fc470208B1f5F3fac19f0a04056c";
export const GMX_READER: Address = "0xf60becbba223EEA9495Da3f606753867eC10d139";
export const DATA_STORE: Address = "0xFD70de6b91282D8017aA4E741e9Ae325CAb992d8";

export const ZERO_ADDRESS: Address =
  "0x0000000000000000000000000000000000000000";
export const USDC_ADDRESS: Address =
  "0xaf88d065e77c8cC2239327C5EDb3A432268e5831";
export const WETH_ADDRESS: Address =
  "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1";

export const USD_DECIMALS = 30;
export const PRECISION = expandDecimals(1, 30);
export const HIGH_SPREAD_THRESHOLD = expandDecimals(1, 30).div(100); // 1%

export const GM_ARB = "0xC25cEf6061Cf5dE5eb761b50E4743c1F5D7E5407";
export const GM_SOL = "0x09400D9DB990D5ed3f35D7be61DfAEB900Af03C9";
export const GM_ETH = "0x70d95587d40A2caf56bd97485aB3Eec10Bee6336";
export const GM_BTC = "0x47c031236e19d024b42f8AE6780E44A573170703";
export const GM_LINK = "0x7f1fa204bb700853D36994DA19F830b6Ad18455C";

export const DAYS_CONSIDERED = 7;
export const MARKET_FEES_URL =
  "https://subgraph.satsuma-prod.com/3b2ced13c8d9/gmx/synthetics-arbitrum-stats/api";
export const INCENTIVE_STATS_URL =
  "https://arbitrum-v2-1-api.gmxinfra.io/incentives";
