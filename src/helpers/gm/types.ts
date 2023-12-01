import type { BigNumber } from "ethers";
import type { Address } from "viem";

export type GasLimits = {
  depositSingleToken: BigNumber;
  withdrawalMultiToken: BigNumber;
  singleSwap: BigNumber;
  estimatedFeeBaseGasLimit: BigNumber;
  estimatedFeeMultiplierFactor: BigNumber;
};

export type TokenPrices = {
  min: BigNumber;
  max: BigNumber;
};

export type TokenPriceResponse = {
  tokenAddress: Address;
  tokenSymbol: String;
  minPrice: String;
  maxPrice: String;
  updatedAt: number;
};

export type MarketPrices = {
  indexTokenPrice: TokenPrices;
  longTokenPrice: TokenPrices;
  shortTokenPrice: TokenPrices;
};

export type MarketInfo = {
  marketToken: Address;
  indexToken: Address;
  longToken: Address;
  shortToken: Address;
};

export type DataStoreInfo = {
  swapFeeFactorForNegativeImpact: BigNumber;
  swapFeeFactorForPositiveImpact: BigNumber;
  longPoolAmount: BigNumber;
  shortPoolAmount: BigNumber;
  longPoolAmountAdjustment: BigNumber;
  shortPoolAmountAdjustment: BigNumber;
  swapImpactFactorPositive: BigNumber;
  swapImpactFactorNegative: BigNumber;
  swapImpactExponentFactor: BigNumber;
  swapImpactPoolAmountLong: BigNumber;
  swapImpactPoolAmountShort: BigNumber;
  longInterestInTokensUsingLongToken: BigNumber;
  longInterestInTokensUsingShortToken: BigNumber;
  shortInterestUsingLongToken: BigNumber;
  shortInterestUsingShortToken: BigNumber;
  reserveFactorLong: BigNumber;
  reserveFactorShort: BigNumber;
  maxLongPoolAmountForDeposit: BigNumber;
  maxShortPoolAmountForDeposit: BigNumber;
  maxLongPoolAmount: BigNumber;
  maxShortPoolAmount: BigNumber;
};

export type SwapMarketInfo = DataStoreInfo & {
  longTokenAddress: Address,
  shortTokenAddress: Address,
  marketTokenAddress: Address,
  longTokenDecimals: number,
  shortTokenDecimals: number,
  indexTokenDecimals: number,
  prices: MarketPrices,
  virtualPoolAmountForLongToken: BigNumber,
  virtualPoolAmountForShortToken: BigNumber,
  longInterestInTokens: BigNumber,
  shortInterestUsd: BigNumber,
}