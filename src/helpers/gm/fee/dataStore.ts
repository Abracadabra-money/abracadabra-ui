import { hashString, hashData } from "./hash";

export const MAX_PNL_FACTOR_FOR_TRADERS_KEY = hashString("MAX_PNL_FACTOR_FOR_TRADERS");
export const POOL_AMOUNT_KEY = hashString("POOL_AMOUNT");
export const SWAP_FEE_FACTOR_KEY = hashString("SWAP_FEE_FACTOR");
export const ESTIMATED_GAS_FEE_BASE_AMOUNT = hashString(
  "ESTIMATED_GAS_FEE_BASE_AMOUNT"
);
export const ESTIMATED_GAS_FEE_MULTIPLIER_FACTOR = hashString(
  "ESTIMATED_GAS_FEE_MULTIPLIER_FACTOR"
);
export const DEPOSIT_GAS_LIMIT_KEY = hashString("DEPOSIT_GAS_LIMIT");
export const SINGLE_SWAP_GAS_LIMIT_KEY = hashString("SINGLE_SWAP_GAS_LIMIT");
export const WITHDRAWAL_GAS_LIMIT_KEY = hashString("WITHDRAWAL_GAS_LIMIT");

export function depositGasLimitKey(singleToken: boolean) {
  return hashData(["bytes32", "bool"], [DEPOSIT_GAS_LIMIT_KEY, singleToken]);
}

export function singleSwapGasLimitKey() {
  return SINGLE_SWAP_GAS_LIMIT_KEY;
}

export function withdrawalGasLimitKey() {
  return hashData(["bytes32"], [WITHDRAWAL_GAS_LIMIT_KEY]);
}

export function poolAmountKey(market: string, token: string) {
  return hashData(["bytes32", "address", "address"], [POOL_AMOUNT_KEY, market, token]);
}

export function swapFeeFactorKey(market: string, forPositiveImpact: boolean) {
  return hashData(["bytes32", "address", "bool"], [SWAP_FEE_FACTOR_KEY, market, forPositiveImpact]);
}