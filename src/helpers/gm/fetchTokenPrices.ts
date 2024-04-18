import axios from "axios";

const url = "https://arbitrum-api.gmxinfra.io/prices/tickers";

export const fetchTokenPrices = async () => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.log("getTokenPrices err:", error);
  }
};
