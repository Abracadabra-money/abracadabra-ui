import axios from "axios";

const chainCoinGeckoIds = {
  1: "ethereum",
  56: "binance-smart-chain",
  137: "polygon-pos",
  250: "fantom",
  42161: "arbitrum-one",
  43114: "avalanche",
};

const config = {
  headers: {
    "X-Cg-Pro-Api-Key": "CG-nguZHRFas4tyUdHhPHwVgN9T", //api key
  },
};

const getTokenPriceByAddress = async (chainId, address) => {
  try {
    const chainCoinGeckoId = chainCoinGeckoIds[chainId];

    if (!chainCoinGeckoId) return false;

    const pricesResponse = await axios.get(
      `https://pro-api.coingecko.com/api/v3/simple/token_price/${chainCoinGeckoId}?contract_addresses=${address}&vs_currencies=usd`,
      config
    );

    const price =
      Object.values(pricesResponse.data).find((data) => data?.usd)?.usd || null;

    console.log("pricesResponse", price);
    return price;
  } catch (e) {
    console.log("TOKEN PRICE ERR:", e);
    return false;
  }
};

export { getTokenPriceByAddress };
