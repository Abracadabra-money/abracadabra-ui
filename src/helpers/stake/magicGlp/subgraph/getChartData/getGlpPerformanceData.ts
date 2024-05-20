import {
  MAINNET_WBTC_ADDRESS,
  AVALANCHE_WAWAX_ADDRESS,
} from "@/constants/tokensAddress";
import type { GlpData } from "@/helpers/stake/magicGlp/types";
import { magicGlpConfig } from "@/configs/stake/magicGlp/magicGlpConfig";
import { getTokenPricesByPeriod } from "@/helpers/prices/getTokenPricesByPeriod";

export const getGlpPerformanceData = async (
  glpData: GlpData[],
  { from = 0, chainId = 42161, month = 1 }
) => {
  const btcPrices = await getTokenPricesByPeriod(
    MAINNET_WBTC_ADDRESS,
    from,
    month
  );

  const avaxPrices = await getTokenPricesByPeriod(
    AVALANCHE_WAWAX_ADDRESS,
    from,
    month
  );

  const { isArbitrumChain } =
    magicGlpConfig[chainId as keyof typeof magicGlpConfig].additionalInfo;

  const glpDataById: { [key: string]: GlpData } = glpData.reduce(
    (memo: { [key: string]: GlpData }, item: GlpData) => {
      memo[item.timestamp] = item;
      return memo;
    },
    {}
  );

  let lastGlpItem: GlpData;

  return btcPrices.reduce(
    (
      accumulator: { timestamp: number; glpApy: number }[],
      price: { timestamp: number; value: number },
      index: number
    ) => {
      const avaxPrice =
        avaxPrices[index]?.value || avaxPrices[index - 1]?.value;
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
    },
    []
  );
};
