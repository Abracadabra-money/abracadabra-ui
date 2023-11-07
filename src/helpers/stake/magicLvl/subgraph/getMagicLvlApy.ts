import axios from "axios";
import moment from "moment";
import { getFeeApy } from "@/helpers/stake/magicLvl/subgraph/getFeeApy";

const subgraphUrl =
  "https://api.thegraph.com/subgraphs/name/0xfantaholic/abra-bsc";

export const getMagicLvlApy = async (feePercent: any) => {
  const query = `{
    levelFinanceDailySnapshots(orderBy: timestamp, orderDirection: asc) {
        timestamp
        seniorApy
      }
  }`;

  const { data } = await axios.post(subgraphUrl, { query });

  const feeApyArr = await Promise.all(
    data.data.levelFinanceDailySnapshots.map(
      async (data: any) => await getFeeApy(Number(data.timestamp))
    )
  );

  const response = data.data.levelFinanceDailySnapshots.map(
    (data: any, idx: number) => {
      return {
        timestamp: data.timestamp,
        seniorApy: +data.seniorApy + feeApyArr[idx].seniorFeeApy,
      };
    }
  );

  const chartData: any = {
    labels: [],
    tickUpper: [],
  };

  response.forEach((element: any) => {
    chartData.labels.push(moment.unix(element.timestamp).format("DD.MM"));
    chartData.tickUpper.push(element.seniorApy * (1 - feePercent));
  });

  const dataset3 = {
    label: "Senior",
    data: chartData.tickUpper,
    borderColor: "#58c6f9",
    pointBackgroundColor: "#58c6f9",
    pointBorderColor: "#58c6f9",
    pointRadius: 0,
    borderWidth: 3,
  };

  return {
    labels: chartData.labels,
    datasets: [dataset3],
  };
};
