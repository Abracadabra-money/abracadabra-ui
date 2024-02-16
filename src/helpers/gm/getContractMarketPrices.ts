import { BigNumber } from "ethers";
import { expandDecimals } from "./fee/expandDecials";
import type { TokenPriceResponse, MarketPrices, MarketInfo } from "./types";

export const getContractMarketPrices = (
  tokenPrices: Array<TokenPriceResponse>,
  market: MarketInfo
): MarketPrices | undefined => {
  const indexToken = tokenPrices.find(
    (item) =>
      item.tokenAddress.toLowerCase() === market.indexToken.toLowerCase()
  );
  const longToken = tokenPrices.find(
    (item) => item.tokenAddress.toLowerCase() === market.longToken.toLowerCase()
  );
  const shortToken = tokenPrices.find(
    (item) =>
      item.tokenAddress.toLowerCase() === market.shortToken.toLowerCase()
  );

  if (!indexToken || !longToken || !shortToken) {
    return undefined;
  }

  return {
    indexTokenPrice: {
      min: BigNumber.from(indexToken.minPrice),
      max: BigNumber.from(indexToken.maxPrice),
    },
    longTokenPrice: {
      min: BigNumber.from(longToken.minPrice),
      max: BigNumber.from(longToken.maxPrice),
    },
    shortTokenPrice: {
      min: BigNumber.from(shortToken.minPrice),
      max: BigNumber.from(shortToken.maxPrice),
    },
  };
};

export const parsePrices = (
  prices: MarketPrices,
  indexTokenDecimals: number,
  longTokenDecimals: number,
  shortTokenDecimals: number
) => {
  return {
    indexTokenPrice: {
      min: prices.indexTokenPrice.min.mul(
        expandDecimals(1, indexTokenDecimals)
      ),
      max: prices.indexTokenPrice.max.mul(
        expandDecimals(1, indexTokenDecimals)
      ),
    },
    longTokenPrice: {
      min: prices.longTokenPrice.min.mul(expandDecimals(1, longTokenDecimals)),
      max: prices.longTokenPrice.max.mul(expandDecimals(1, longTokenDecimals)),
    },
    shortTokenPrice: {
      min: prices.shortTokenPrice.min.mul(
        expandDecimals(1, shortTokenDecimals)
      ),
      max: prices.shortTokenPrice.max.mul(
        expandDecimals(1, shortTokenDecimals)
      ),
    },
  };
};
