import type { MarketToken } from "./types";

export const getMarketTokenInfo = (
  marketFullInfo: any,
  isDeposit: Boolean
): MarketToken => {
  const minPrice = isDeposit
    ? marketFullInfo.marketTokenPriceDepositMin
    : marketFullInfo.marketTokenPriceWithdrawMin;

  const maxPrice = isDeposit
    ? marketFullInfo.marketTokenPriceDepositMax
    : marketFullInfo.marketTokenPriceWithdrawMax;

  return {
    address: marketFullInfo.market,
    totalSupply: marketFullInfo.totalSupply,
    prices: {
      min: minPrice[0],
      max: maxPrice[0],
    },
  };
};
