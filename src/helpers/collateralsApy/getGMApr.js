import { getMarketsApr } from "../gm/apr/getMarketApr";
import { utils } from "ethers";

export const getGMApr = async (market, provider) => {
  const marketsApr = await getMarketsApr(provider);
  const aprData = marketsApr.marketsTokensAPRData[market];
  const incentiveAprData = marketsApr.marketsTokensIncentiveAprData[market];
  const apr = aprData.add(incentiveAprData);

  return utils.formatUnits(apr, 2);
};
