import expandDecimals from "./expand-decimals";

export default (amount, divDecimals, mulDecimals) =>
  amount
    .mul(expandDecimals(1, mulDecimals))
    .div(expandDecimals(1, divDecimals));
