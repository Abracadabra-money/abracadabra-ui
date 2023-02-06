import axios from "axios";

const getXbooApy = async () => {
    try {
      const response = await axios.get("https://api.spookyswap.finance/api/xboo");
      return response.data;
    } catch (e) {
      console.log("getXBOOApy err: ", e);
      return null;
    }
  };

export { getXbooApy }