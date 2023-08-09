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

const config = {
  headers: {
    "X-Cg-Pro-Api-Key": import.meta.env.VITE_APP_COINGECKO_API_KEY,
  },
};

const getTokensArrayPrices = async (chainId, addressArr) => {
  try {
    const chainCoinGeckoId = chainCoinGeckoIds[chainId];

    if (!chainCoinGeckoId) return false;

    const pricesResponse = await axios.get(
      `https://${apiDomain}/api/v3/simple/token_price/${chainCoinGeckoId}?contract_addresses=${addressArr.join()}&vs_currencies=usd`,
      config
    );

    const respToArray = [];

    for (const property in pricesResponse.data) {
      respToArray.push({
        address: property.toLowerCase(),
        price: pricesResponse.data[property].usd,
      });
    }

    return respToArray;
  } catch (e) {
    console.log("TOKEN PRICE ERR:", e);
    return false;
  }
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

const numberWithCommas = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

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

const getNativeTokenPrice = async (chainId) => {
  try {
    const id = coingeckoChainId[chainId];
    const url = `https://${apiDomain}/api/v3/coins/${id}`;
    const response = await axios.get(url, config);
    return response.data.market_data.current_price.usd;
  } catch (error) {
    console.log("Get token price Error:", error);
    return "0.0";
  }
};

export {
  getTokenPriceByAddress,
  getTokensArrayPrices,
  numberWithCommas,
  getNativeTokenPrice,
};
