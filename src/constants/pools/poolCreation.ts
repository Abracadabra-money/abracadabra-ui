import { parseUnits } from "viem";

export const SUPPORTED_CHAINS = [42161];


export const K_VALUE_DECIMALS = 18;
export const FEE_TIER_DECIMALS = 16;

export const STANDARD_K_VALUE = parseUnits("1", K_VALUE_DECIMALS);
export const STANDARD_FEE_TIER = parseUnits("0.03", FEE_TIER_DECIMALS);
export const STANDARD_I_VALUE = 1000000n;

export enum TokenTypes {
    Base = "base",
    Quote = "quote",
}

export enum PoolTypes {
    Standard = "standard",
    Pegged = "pegged",
}