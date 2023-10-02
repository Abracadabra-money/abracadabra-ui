import { getTokenArrayPriceByPeriod } from "@/helpers/priceHelper";
import { magicGlpConfig } from "@/utils/stake/magicGlpConfig";

export const getGlpPerformanceData = async (
  glpData: any,
  { from, chainId = 42161 }: any
) => {
  const btcPrices = await getTokenArrayPriceByPeriod("BTC", from);
  const avaxPrices = await getTokenArrayPriceByPeriod("AVAX", from);
  const { isArbitrumChain }: any | undefined =
    magicGlpConfig[chainId as keyof typeof magicGlpConfig].additionalInfo;

  const glpDataById = glpData.reduce((memo: any, item: any) => {
    memo[item.timestamp] = item;
    return memo;
  }, {});

  let lastGlpItem: any;

  return btcPrices.reduce((accumulator: any, price: any, index: any) => {
    const avaxPrice = avaxPrices[index]?.value || avaxPrices[index - 1]?.value;
    const timestamp = parseInt((price.timestamp / 86400).toString()) * 86400;
    const glpItem = glpDataById[timestamp] || lastGlpItem;
    lastGlpItem = glpItem;

    if (!glpItem) return accumulator;

    const { distributedUsdPerGlp, glpPrice } = glpItem;

    const glpApr = isArbitrumChain
      ? (distributedUsdPerGlp / glpPrice) * 365 * 100
      : (((distributedUsdPerGlp / 100) * avaxPrice) / glpPrice) * 365 * 100;

    accumulator.push({
      timestamp: price.timestamp,
      glpApy: (Math.pow(1 + glpApr / 100 / 730, 730) - 1) * 100,
    });

    return accumulator;
  }, []);
};
