import { fetchTokenPrices } from "./fetchTokenPrices";

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
      min: indexToken.minPrice,
      max: indexToken.maxPrice,
    },
    longTokenPrice: {
      min: longToken.minPrice,
      max: longToken.maxPrice,
    },
    shortTokenPrice: {
      min: shortToken.minPrice,
      max: shortToken.maxPrice,
    },
  };
};
