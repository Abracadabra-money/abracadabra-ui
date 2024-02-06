import { magicGlpConfig } from "@/configs/stake/magicGlpConfig";
import { getTokenPricesByPeriod } from "@/helpers/prices/getTokenPricesByPeriod";

export const getGlpPerformanceData = async (
  glpData: any,
  { from, chainId = 42161, month = 1 }: any
) => {
  const btcPrices = await getTokenPricesByPeriod(
    "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
    from,
    month
  );

  const avaxPrices = await getTokenPricesByPeriod(
    "0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7",
    from,
    month
  );

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
