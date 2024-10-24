import axios from "axios";

const url = "https://arbitrum-api.gmxinfra.io/prices/tickers";
const alternativeUrl = "https://arbitrum-api.gmxinfra2.io/prices/tickers";
const pingUrl1 = "https://arbitrum-api.gmxinfra.io/ping";
const pingUrl2 = "https://arbitrum-api.gmxinfra2.io/ping";

const checkPing = async (pingUrl: string) => {
  try {
    const ping = await axios.get(pingUrl);
    return ping.status === 200;
  } catch (error) {
    return false;
  }
};

export const fetchTokenPrices = async () => {
  try {
    const isPingSuccess = await checkPing(pingUrl1);
    if (isPingSuccess) {
      const response = await axios.get(url);
      return response.data;
    } else {
      throw new Error("Ping to primary URL failed");
    }
  } catch (error) {
    console.log("Primary URL failed. Trying alternative URL...");

    const isPingSuccessAlt = await checkPing(pingUrl2);
    if (!isPingSuccessAlt) {
      throw new Error("Ping to alternative URL failed");
    }

    const response = await axios.get(alternativeUrl);
    return response.data;
  }
};
