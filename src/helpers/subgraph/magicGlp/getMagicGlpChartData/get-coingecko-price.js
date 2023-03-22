const { default: axios } = require("axios");

const getCoingeckoPrice = async (symbol, { from }) => {
  const _symbol = {
    BTC: "bitcoin",
    ETH: "ethereum",
    LINK: "chainlink",
    UNI: "uniswap",
    AVAX: "avalanche-2",
  }[symbol];

  const now = Date.now() / 1000;
  const days = Math.ceil(now / 86400) - Math.ceil(from / 86400) - 1;

  const apiDomain = process.env.VUE_APP_COINGECKO_API_KEY_2
    ? "pro-api.coingecko.com"
    : "api.coingecko.com";

  const config = {
    headers: {
      "X-Cg-Pro-Api-Key": process.env.VUE_APP_COINGECKO_API_KEY_2,
    },
  };

  const url = `https://${apiDomain}/api/v3/coins/${_symbol}/market_chart?vs_currency=usd&days=${days}&interval=daily`;

  const { data } = await axios.get(url, config);

  return data.prices.map((item) => {
    // -1 is for shifting to previous day
    // because CG uses first price of the day, but for GLP we store last price of the day
    const timestamp = item[0] - 1;
    const groupTs = parseInt(timestamp / 1000 / 86400) * 86400;
    return {
      timestamp: groupTs,
      value: item[1],
    };
  });
};

module.exports = getCoingeckoPrice;
