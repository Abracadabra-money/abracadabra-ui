import axios from "axios";

const subgraphUrl =
  "https://api.thegraph.com/subgraphs/name/0xfantaholic/abra-bsc";

export const getLevelFinanceChartData = async () => {
  const query = `{
    levelFinanceDailySnapshots(orderBy: timestamp, orderDirection: desc) {
        timestamp
        seniorApy
        mezzanineApy
        juniorApy
      }
  }`;

  const { data } = await axios.default.post(subgraphUrl, { query });
  return data.data.levelFinanceDailySnapshots;
};
