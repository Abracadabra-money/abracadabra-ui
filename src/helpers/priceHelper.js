import axios from "axios";

const apiDomain = import.meta.env.VITE_APP_COINGECKO_API_KEY
  ? "pro-api.coingecko.com"
  : "api.coingecko.com";

const coingeckoSymbol = {
  BTC: "bitcoin",
  ETH: "ethereum",
  LINK: "chainlink",
  UNI: "uniswap",
  AVAX: "avalanche-2",
};

const config = {
  headers: {
    "X-Cg-Pro-Api-Key": import.meta.env.VITE_APP_COINGECKO_API_KEY,
  },
};

const getTokenArrayPriceByPeriod = async (symbol, period) => {
  const now = Date.now() / 1000;
  const days = Math.ceil(now / 86400) - Math.ceil(period / 86400) - 1;

  const tokenSymbol = coingeckoSymbol[symbol];

  const url = `https://${apiDomain}/api/v3/coins/${tokenSymbol}/market_chart?vs_currency=usd&days=${days}&interval=daily`;
  const { data } = await axios.get(url, config);

  return data.prices.map((item) => {
    const timestamp = item[0] - 1;
    const groupTs = parseInt((timestamp / 1000 / 86400).toString()) * 86400;
    return {
      timestamp: groupTs,
      value: item[1],
    };
  });
};

export { getTokenArrayPriceByPeriod };
