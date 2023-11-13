import { hashString, hashData } from "./hash";

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
