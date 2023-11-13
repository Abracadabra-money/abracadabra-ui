import { expandDecimals } from "./expandDecials";

export const PRECISION = expandDecimals(1, 30);

export const applyFactor = (value, factor) => {
  return value.mul(factor).div(PRECISION);
};
