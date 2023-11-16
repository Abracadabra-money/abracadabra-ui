import axios from "axios";

const chainCoinGeckoIds = {
  1: "ethereum",
  10: "optimistic-ethereum",
  56: "binance-smart-chain",
  137: "polygon-pos",
  250: "fantom",
  1285: "moonriver",
  2222: "kava",
  42161: "arbitrum-one",
  43114: "avalanche",
};

const apiDomain = import.meta.env.VITE_APP_COINGECKO_API_KEY
  ? "pro-api.coingecko.com"
  : "api.coingecko.com";

const coingeckoChainId = {
  1: "ethereum",
  10: "ethereum",
  56: "binancecoin",
  137: "matic-network",
  250: "fantom",
  1285: "moonriver",
  2222: "kava",
  42161: "ethereum",
  43114: "avalanche-2",
  8453: "ethereum",
  59144: "ethereum",
};

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

const getTokenPriceByAddress = async (chainId, address) => {
  try {
    const chainCoinGeckoId = chainCoinGeckoIds[chainId];

    if (!chainCoinGeckoId) return false;

    const pricesResponse = await axios.get(
      `https://${apiDomain}/api/v3/simple/token_price/${chainCoinGeckoId}?contract_addresses=${address}&vs_currencies=usd`,
      config
    );

    let price = null;

    for (const property in pricesResponse.data) {
      price = pricesResponse.data[property]?.usd;
    }

    return price;
  } catch (e) {
    console.log("TOKEN PRICE ERR:", e);
    return false;
  }
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

export { getTokenPriceByAddress, getTokenArrayPriceByPeriod };
