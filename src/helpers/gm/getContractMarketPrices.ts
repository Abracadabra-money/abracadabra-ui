import { fetchTokenPrices } from "./fetchTokenPrices";
import { BigNumber } from "ethers";
import type { MarketInfo } from "./types";

import type { TokenPriceResponse, MarketPrices } from "./types";

export const getContractMarketPrices = (
  tokenPrices: Array<TokenPriceResponse>,
  market: MarketInfo
): MarketPrices => {
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
    // @ts-ignore
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
