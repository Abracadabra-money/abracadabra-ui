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

const getTokensArrayPrices = async (chainId, addressArr) => {
  try {
    const chainCoinGeckoId = chainCoinGeckoIds[chainId];

    if (!chainCoinGeckoId) return false;

    const pricesResponse = await axios.get(
      `https://api.coingecko.com/api/v3/simple/token_price/${chainCoinGeckoId}?contract_addresses=${addressArr.join()}&vs_currencies=usd`,
      config
    );

    const respToArray = [];

    for (const property in pricesResponse.data) {
      //   console.log(`${property}: ${pricesResponse.data[property].usd}`);

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
      `https://api.coingecko.com/api/v3/simple/token_price/${chainCoinGeckoId}?contract_addresses=${address}&vs_currencies=usd`,
      config
    );

    let price = null;

    for (const property in pricesResponse.data) {
      console.log(`${property}: ${pricesResponse.data[property].usd}`);

      price = pricesResponse.data[property]?.usd;
    }

    console.log("pricesResponse", price);
    return price;
  } catch (e) {
    console.log("TOKEN PRICE ERR:", e);
    return false;
  }
};

const numberWithCommas = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export { getTokenPriceByAddress, getTokensArrayPrices, numberWithCommas };
