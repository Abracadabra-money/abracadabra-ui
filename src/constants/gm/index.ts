import { expandDecimals } from "@/helpers/gm/fee/expandDecials";
import type { Address } from "viem";

export const ORDER_AGENT: Address = "0x49676b9bbbe9db0dd3a94cd6db68b5e2c7969757";
export const GMX_READER: Address = "0xf60becbba223EEA9495Da3f606753867eC10d139";
export const DATA_STORE: Address = "0xFD70de6b91282D8017aA4E741e9Ae325CAb992d8";

export const ZERO_ADDRESS: Address = "0x0000000000000000000000000000000000000000";
export const USDC_ADDRESS: Address = "0xaf88d065e77c8cC2239327C5EDb3A432268e5831";
export const WETH_ADDRESS: Address= "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1";

export const USD_DECIMALS = 30;
export const PRECISION = expandDecimals(1, 30);
export const HIGH_SPREAD_THRESHOLD = expandDecimals(1, 30).div(100); // 1%