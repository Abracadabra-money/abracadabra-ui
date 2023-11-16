import { PRECISION } from "@/constants/gm";

export const applyFactor = (value, factor) => {
  return value.mul(factor).div(PRECISION);
};
