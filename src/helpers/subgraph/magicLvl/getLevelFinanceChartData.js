import axios from "axios";

import { getFeeApy } from "./getFeeApy";

const subgraphUrl =
  "https://api.thegraph.com/subgraphs/name/0xfantaholic/abra-bsc";

export const getLevelFinanceChartData = async () => {
  const query = `{
    levelFinanceDailySnapshots(orderBy: timestamp, orderDirection: asc) {
        timestamp
        seniorApy
        mezzanineApy
        juniorApy
      }
  }`;

  const { data } = await axios.default.post(subgraphUrl, { query });
  
  const feeApyArr = await Promise.all(
    data.data.levelFinanceDailySnapshots.map(
      async (data) => await getFeeApy(Number(data.timestamp))
    )
  );

  const updatedData = data.data.levelFinanceDailySnapshots.map((data, idx) => {
    return {
      timestamp: data.timestamp,
      juniorApy: +data.juniorApy + feeApyArr[idx].juniorFeeApy,
      mezzanineApy: +data.mezzanineApy + feeApyArr[idx].mezzanineFeeApy,
      seniorApy: +data.seniorApy + feeApyArr[idx].seniorFeeApy
    }
  })

  return updatedData;
};
