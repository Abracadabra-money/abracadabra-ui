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
        mezzanineApy
        juniorApy
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
        juniorApy: +data.juniorApy + feeApyArr[idx].juniorFeeApy,
        mezzanineApy: +data.mezzanineApy + feeApyArr[idx].mezzanineFeeApy,
        seniorApy: +data.seniorApy + feeApyArr[idx].seniorFeeApy,
      };
    }
  );

  const chartData: any = {
    labels: [],
    tickUpper: [],
    tickUpper2: [],
    tickUpper3: [],
  };

  response.forEach((element: any) => {
    chartData.labels.push(moment.unix(element.timestamp).format("DD.MM"));
    chartData.tickUpper.push(element.juniorApy * (1 - feePercent));
    chartData.tickUpper2.push(element.mezzanineApy * (1 - feePercent));
    chartData.tickUpper3.push(element.seniorApy * (1 - feePercent));
  });

  const dataset1 = {
    label: "Junior",
    data: chartData.tickUpper,
    borderColor: "#ff7101",
    pointBackgroundColor: "#ff7101",
    pointBorderColor: "#ff7101",
    pointRadius: 0,
    borderWidth: 4,
  };

  const dataset2 = {
    label: "Mezzanine",
    data: chartData.tickUpper2,
    borderColor: "#874efb",
    pointBackgroundColor: "#874efb",
    pointBorderColor: "#874efb",
    pointRadius: 0,
    borderWidth: 3,
  };

  const dataset3 = {
    label: "Senior",
    data: chartData.tickUpper3,
    borderColor: "#58c6f9",
    pointBackgroundColor: "#58c6f9",
    pointBorderColor: "#58c6f9",
    pointRadius: 0,
    borderWidth: 3,
  };

  return {
    labels: chartData.labels,
    datasets: [dataset1, dataset2, dataset3],
  };
};
