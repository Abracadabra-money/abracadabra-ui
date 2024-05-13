import { getMarketsApr } from "../gm/apr/getMarketApr";
import { utils, BigNumber } from "ethers";

export const ABRA_FEES = 1000; // 10%
export const BASIS_POINTS_DIVISOR = 10000;

export const getGMApr = async (market, provider) => {
  const marketsApr = await getMarketsApr(provider);
  const aprData = BigNumber.from(marketsApr.marketsTokensAPRData[market]);
  // const incentiveAprData = BigNumber.from(marketsApr.marketsTokensIncentiveAprData[market]);

  // const feesBasicPoints = BASIS_POINTS_DIVISOR - ABRA_FEES;
  // const bonusApr = incentiveAprData
  //   .mul(feesBasicPoints)
  //   .div(BASIS_POINTS_DIVISOR)

  // const apr = aprData.add(bonusApr);

  return utils.formatUnits(aprData, 2);
};
