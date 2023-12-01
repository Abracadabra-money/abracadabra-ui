import type { BigNumber } from "ethers";
import { PRECISION } from "@/constants/gm";

export const applyFactor = (value: BigNumber, factor: BigNumber): BigNumber => {
  return value.mul(factor).div(PRECISION);
};
