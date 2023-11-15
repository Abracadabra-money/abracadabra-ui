import type { BigNumber } from "ethers";
import { expandDecimals } from "./fee/expandDecials";

export function convertToUsd(
  tokenAmount: BigNumber | undefined,
  tokenDecimals: number | undefined,
  price: BigNumber | undefined
) {
  if (!tokenAmount || typeof tokenDecimals !== "number" || !price) {
    return undefined;
  }

  return tokenAmount.mul(price).div(expandDecimals(1, tokenDecimals));
}

export function convertToTokenAmount(
  usd: BigNumber | undefined,
  tokenDecimals: number | undefined,
  price: BigNumber | undefined
) {
  if (!usd || typeof tokenDecimals !== "number" || !price?.gt(0)) {
    return undefined;
  }

  return usd.mul(expandDecimals(1, tokenDecimals)).div(price);
}