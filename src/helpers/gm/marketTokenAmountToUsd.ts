import { BigNumber } from "ethers";
import { convertToUsd } from "./utils";
import { expandDecimals } from "./fee/expandDecials";

import { convertToTokenAmount } from "./utils";

import { USD_DECIMALS } from "@/constants/gm";

export const marketTokenAmountToUsd = (
  totalSupply: BigNumber,
  poolValueMax: BigNumber,
  amount: BigNumber
): BigNumber => {
  const price = totalSupply.eq(0)
    ? expandDecimals(1, USD_DECIMALS)
    : poolValueMax.mul(expandDecimals(1, 18)).div(totalSupply);

  return convertToUsd(amount, 18, price);
};

export function usdToMarketTokenAmount(
  totalSupply: BigNumber,
  poolValueMax: BigNumber,
  usdValue: BigNumber
) {
  // if the supply and poolValue is zero, use 1 USD as the token price
  if (totalSupply.eq(0) && poolValueMax.eq(0)) {
    return convertToTokenAmount(usdValue, 18, expandDecimals(1, USD_DECIMALS))!;
  }

  // if the supply is zero and the poolValue is more than zero,
  // then include the poolValue for the amount of tokens minted so that
  // the market token price after mint would be 1 USD
  if (totalSupply.eq(0) && poolValueMax.gt(0)) {
    return convertToTokenAmount(
      usdValue.add(poolValueMax),
      18,
      expandDecimals(1, USD_DECIMALS)
    )!;
  }

  if (poolValueMax.eq(0)) {
    return BigNumber.from(0);
  }

  return totalSupply.mul(usdValue).div(poolValueMax);
}
