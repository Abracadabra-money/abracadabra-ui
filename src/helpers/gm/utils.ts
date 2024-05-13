import { BigNumber } from "ethers";
import { expandDecimals } from "./fee/expandDecials";
import { PRECISION, USD_DECIMALS } from "@/constants/gm";

export function convertToUsd(
  tokenAmount: BigNumber,
  tokenDecimals: number,
  price: BigNumber
): BigNumber {
  return tokenAmount.mul(price).div(expandDecimals(1, tokenDecimals));
}

export function convertToTokenAmount(
  usd: BigNumber,
  tokenDecimals: number,
  price: BigNumber
): BigNumber {
  return usd.mul(expandDecimals(1, tokenDecimals)).div(price);
}

export function getMidPrice(prices: any) {
  return prices.min.add(prices.max).div(2);
}

export function roundUpMagnitudeDivision(a: BigNumber, b: BigNumber) {
  if (a.lt(0)) {
    return a.sub(b).add(1).div(b);
  }

  return a.add(b).sub(1).div(b);
}

export function getPoolUsdWithoutPnl(
  marketInfo: any,
  isLong: boolean,
  priceType: "minPrice" | "maxPrice" | "midPrice"
) {
  const poolAmount = isLong
    ? marketInfo.longPoolAmount
    : marketInfo.shortPoolAmount;
  const token = isLong
    ? { prices: marketInfo.prices.longTokenPrice, decimals: 18 }
    : { prices: marketInfo.prices.shortTokenPrice, decimals: 6 };

  let price: BigNumber;

  if (priceType === "minPrice") {
    price = token.prices?.min;
  } else if (priceType === "maxPrice") {
    price = token.prices?.max;
  } else {
    price = getMidPrice(token.prices);
  }

  return convertToUsd(poolAmount, token.decimals, price)!;
}

export function getReservedUsd(marketInfo: any, isLong: boolean) {
  // const { indexToken } = marketInfo;

  if (isLong) {
    // notice index token decimal
    return convertToUsd(
      marketInfo.longInterestInTokens,
      18,
      marketInfo.prices.indexTokenPrice.max
    );
  } else {
    return marketInfo.shortInterestUsd;
  }
}

export function getSpread(p: { min: BigNumber; max: BigNumber }): BigNumber {
  const diff = p.max.sub(p.min);
  return diff.mul(PRECISION).div(p.max.add(p.min).div(2));
}

export function getMaxPoolAmountForDeposit(marketInfo: any, isLong: boolean) {
  const maxAmountForDeposit = isLong ? marketInfo.maxLongPoolAmountForDeposit : marketInfo.maxShortPoolAmountForDeposit;
  const maxAmountForSwap = isLong ? marketInfo.maxLongPoolAmount : marketInfo.maxShortPoolAmount;

  return maxAmountForDeposit.lt(maxAmountForSwap) ? maxAmountForDeposit : maxAmountForSwap;
}


export function getDepositCollateralCapacityAmount(marketInfo: any, isLong: boolean) {
  const poolAmount = isLong ? marketInfo.longPoolAmount : marketInfo.shortPoolAmount;
  const maxPoolAmount = getMaxPoolAmountForDeposit(marketInfo, isLong);

  const capacityAmount = maxPoolAmount.sub(poolAmount);

  return capacityAmount.gt(0) ? capacityAmount : BigNumber.from(0);
}

export function getMintableMarketTokens(marketInfo: any) {
  const longDepositCapacityAmount = getDepositCollateralCapacityAmount(marketInfo, true);
  const shortDepositCapacityAmount = getDepositCollateralCapacityAmount(marketInfo, false);

  return {
    longDepositCapacityAmount,
    shortDepositCapacityAmount,
  };
}