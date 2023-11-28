import axios from "axios";
import { COINGECKO_URL } from "@/constants/urls";

const coinGeckoIds = {
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

export const getTokenPriceByAddress = async (
  chainId: number,
  address: string
) => {
  try {
    const chainCoinGeckoId = coinGeckoIds[chainId as keyof typeof coinGeckoIds];

    if (!chainCoinGeckoId) return 0;

    const pricesResponse = await axios.get(
      `${COINGECKO_URL}simple/token_price/${chainCoinGeckoId}?contract_addresses=${address}&vs_currencies=usd`
    );

    let price = null;

    for (const property in pricesResponse.data) {
      price = pricesResponse.data[property]?.usd;
    }

    return price;
  } catch (e) {
    console.log("TOKEN PRICE ERR:", e);
    return 0;
  }
};
