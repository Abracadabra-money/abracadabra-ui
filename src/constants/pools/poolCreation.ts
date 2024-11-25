import { parseUnits } from "viem";

export const SUPPORTED_CHAINS = [42161];

export const K_VALUE_DECIMALS = 18;
export const FEE_TIER_DECIMALS = 16;
export const RATE_DECIMALS = 36;

export const STANDARD_K_VALUE = parseUnits("1", K_VALUE_DECIMALS);
export const SAFE_PEGGED_K_VALUE = parseUnits("0.0001", K_VALUE_DECIMALS);

export const STANDARD_FEE_TIER = parseUnits("0.03", FEE_TIER_DECIMALS);
export const STANDARD_I_VALUE = 1000000n;

export const RATE_PRECISION = parseUnits("1", RATE_DECIMALS);

export enum TokenTypes {
  Base = "base",
  Quote = "quote",
}

export enum PoolTypes {
  Standard = "standard",
  Pegged = "pegged",
}

export const poolTypesArray = [PoolTypes.Standard, PoolTypes.Pegged];

export const feeTiersArray = [
  300000000000000n,
  400000000000000n,
  500000000000000n,
];

export enum EmptyStateTypes {
  PoolType = "poolType",
  Pair = "pair",
}

export const graphAPIs = {
  1: "https://api.studio.thegraph.com/query/59137/mimswap-mainnet/version/latest",
  2222: "https://kava.graph.abracadabra.money/subgraphs/name/mimswap",
  42161:
    "https://api.studio.thegraph.com/query/59137/mimswap-arbitrum/version/latest",
  81457:
    "https://api.studio.thegraph.com/query/59137/mimswap-blast/version/latest",
};
