import { fetchTokenPrices } from "./fetchTokenPrices";
import { BigNumber } from "ethers";

export const getContractMarketPrices = async (market) => {
  const tokenPrices = await fetchTokenPrices();

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
