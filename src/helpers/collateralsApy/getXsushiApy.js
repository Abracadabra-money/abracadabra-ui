import sushiData from "@sushiswap/sushi-data";

export const getXsushiApy = async () => {
    try {
      const results = await Promise.all([
        sushiData.bar.info(),
        sushiData.exchange.dayData(),
        sushiData.sushi.priceUSD(),
      ]);
      const apr =
        (((results[1][1].volumeUSD * 0.05) / results[0].totalSupply) * 365) /
        (results[0].ratio * results[2]);
  
      return apr;
    } catch (e) {
      console.log("getTokenXSushiAPY err", e);
      return null;
    }
  };