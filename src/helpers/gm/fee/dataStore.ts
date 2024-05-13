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
export const POOL_AMOUNT_ADJUSTMENT_KEY = hashString("POOL_AMOUNT_ADJUSTMENT");
export const SWAP_IMPACT_FACTOR_KEY = hashString("SWAP_IMPACT_FACTOR");
export const SWAP_IMPACT_EXPONENT_FACTOR_KEY = hashString("SWAP_IMPACT_EXPONENT_FACTOR");
export const SWAP_IMPACT_POOL_AMOUNT_KEY = hashString("SWAP_IMPACT_POOL_AMOUNT");
export const OPEN_INTEREST_IN_TOKENS_KEY = hashString("OPEN_INTEREST_IN_TOKENS");
export const OPEN_INTEREST_KEY = hashString("OPEN_INTEREST");
export const RESERVE_FACTOR_KEY = hashString("RESERVE_FACTOR");
export const MAX_POOL_AMOUNT_FOR_DEPOSIT_KEY = hashString("MAX_POOL_AMOUNT_FOR_DEPOSIT");
export const MAX_POOL_AMOUNT_KEY = hashString("MAX_POOL_AMOUNT");
export const MAX_PNL_FACTOR_FOR_WITHDRAWALS_KEY = hashString("MAX_PNL_FACTOR_FOR_WITHDRAWALS");
export const MAX_PNL_FACTOR_FOR_DEPOSITS_KEY = hashString("MAX_PNL_FACTOR_FOR_DEPOSITS");

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

export function poolAmountAdjustmentKey(market: string, token: string) {
  return hashData(["bytes32", "address", "address"], [POOL_AMOUNT_ADJUSTMENT_KEY, market, token]);
}

export function swapImpactFactorKey(market: string, isPositive: boolean) {
  return hashData(["bytes32", "address", "bool"], [SWAP_IMPACT_FACTOR_KEY, market, isPositive]);
}

export function swapImpactExponentFactorKey(market: string) {
  return hashData(["bytes32", "address"], [SWAP_IMPACT_EXPONENT_FACTOR_KEY, market]);
}

export function swapImpactPoolAmountKey(market: string, token: string) {
  return hashData(["bytes32", "address", "address"], [SWAP_IMPACT_POOL_AMOUNT_KEY, market, token]);
}

export function openInterestInTokensKey(market: string, collateralToken: string, isLong: boolean) {
  return hashData(
    ["bytes32", "address", "address", "bool"],
    [OPEN_INTEREST_IN_TOKENS_KEY, market, collateralToken, isLong]
  );
}

export function openInterestKey(market: string, collateralToken: string, isLong: boolean) {
  return hashData(["bytes32", "address", "address", "bool"], [OPEN_INTEREST_KEY, market, collateralToken, isLong]);
}

export function reserveFactorKey(market: string, isLong: boolean) {
  return hashData(["bytes32", "address", "bool"], [RESERVE_FACTOR_KEY, market, isLong]);
}

export function maxPoolAmountForDepositKey(market: string, token: string) {
  return hashData(["bytes32", "address", "address"], [MAX_POOL_AMOUNT_FOR_DEPOSIT_KEY, market, token]);
}

export function maxPoolAmountKey(market: string, token: string) {
  return hashData(["bytes32", "address", "address"], [MAX_POOL_AMOUNT_KEY, market, token]);
}
