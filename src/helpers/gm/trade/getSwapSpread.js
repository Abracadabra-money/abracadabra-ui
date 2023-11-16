import { getSpread } from "../utils";
import { HIGH_SPREAD_THRESHOLD } from "@/constants/gm";

export const getSwapSpread = (fromTokenPrices, toTokenPrices) => {
  const fromSpread = getSpread(fromTokenPrices);
  const toSpread = getSpread(toTokenPrices);

  const spread = fromSpread.add(toSpread);

  const isHigh = spread.gt(HIGH_SPREAD_THRESHOLD);

  return { spread, isHigh };
};
