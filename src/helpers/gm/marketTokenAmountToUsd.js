import { convertToUsd } from "./utils";
import { expandDecimals } from "./fee/expandDecials";

import { USD_DECIMALS } from "@/constants/gm";

export const marketTokenAmountToUsd = (totalSupply, poolValueMax, amount) => {
  const price = totalSupply.eq(0)
    ? expandDecimals(1, USD_DECIMALS)
    : poolValueMax.mul(expandDecimals(1, 18)).div(totalSupply);

  return convertToUsd(amount, 18, price);
};