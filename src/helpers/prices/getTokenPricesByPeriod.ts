import axios from "axios";
import { COINGECKO_URL } from "@/constants/global";
import btcPrices from "@/utils/magicGlp/btcPrices";
import avaxPrices from "@/utils/magicGlp/avaxPrices";
import { ONE_MILLISECOND, SECONDS_PER_DAY } from "@/constants/global";

const tokensSymbol = {
  "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599": "bitcoin",
  "0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7": "avalanche-2",
};

export const getTokenPricesByPeriod = async (
  tokenAddress: string,
  timestamp: number,
  month: number = 1
) => {
  try {
    const now = Date.now() / ONE_MILLISECOND;
    const days =
      Math.ceil(now / SECONDS_PER_DAY) -
      Math.ceil(timestamp / SECONDS_PER_DAY) -
      1;

    const tokenSymbol = tokensSymbol[tokenAddress as keyof typeof tokensSymbol];

    const url = `${COINGECKO_URL}coins/${tokenSymbol}/market_chart?vs_currency=usd&days=${days}&interval=daily`;
    const { data } = await axios.get(url);

    return data.prices.map((price: any) => {
      const timestamp = price[0] - 1;
      const groupTs =
        parseInt((timestamp / ONE_MILLISECOND / SECONDS_PER_DAY).toString()) *
        SECONDS_PER_DAY;

      return {
        timestamp: groupTs,
        value: price[1],
      };
    });
  } catch (error) {
    switch (tokenAddress) {
      case "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599":
        return [...btcPrices].splice(btcPrices?.length - month * 30);
      case "0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7":
        return [...avaxPrices].splice(avaxPrices?.length - month * 30);
      default:
        break;
    }
  }
};
