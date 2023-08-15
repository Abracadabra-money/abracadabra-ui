import moment from "moment";
import { getGlpData } from "@/helpers/stake/magicGlp/subgraph/getChartData/getGlpData";
import getFeesData from "@/helpers/stake/magicGlp/subgraph/getChartData/getFeesData";
import { getGlpPerformanceData } from "@/helpers/stake/magicGlp/subgraph/getChartData/getGlpPerformanceData";

export const getChartData = async (
  chainId: number,
  month = 3,
  feePercent: any
) => {
  const pastMonth = moment().subtract(month, "month").toDate();
  const pastDay = moment().subtract(1, "day").toDate();
  const groupPeriod = 86400;

  const from = Math.floor(+new Date(pastMonth) / 1000);
  const to = Math.floor(+new Date(pastDay) / 1000);

  const params = { from, to, groupPeriod, chainId };

  const glpData = await getGlpData(params);
  const feesData = await getFeesData(params);

  const glpPerformanceData = await getGlpPerformanceData(
    glpData,
    feesData,
    params
  );

  const chartData: any = { labels: [], tickUpper: [] };

  glpPerformanceData.forEach((element: any) => {
    chartData.labels.push(moment.unix(element.timestamp).format("DD.MM"));
    chartData.tickUpper.push(element.glpApy * (1 - feePercent));
  });

  return {
    labels: chartData.labels,
    datasets: [
      {
        label: "APY",
        data: chartData.tickUpper,
        borderColor: "#73b6f6 ",
        pointBackgroundColor: "#73b6f6",
        pointBorderColor: "#73b6f6",
        pointRadius: 0,
        borderWidth: 2,
      },
    ],
  };
};
