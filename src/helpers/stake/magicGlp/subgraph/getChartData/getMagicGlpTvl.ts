import moment from "moment";
import { getGlpData } from "@/helpers/stake/magicGlp/subgraph/getChartData/getGlpData";
import { getGlpPerformanceData } from "@/helpers/stake/magicGlp/subgraph/getChartData/getGlpPerformanceData";

export const getMagicGlpTvl = async (
  chainId: number,
  month = 3,
  feePercent = 0.1
) => {
  const pastMonth = moment().subtract(month, "month").toDate();
  const pastDay = moment().subtract(1, "day").toDate();
  const groupPeriod = 86400;

  const from = Math.floor(+new Date(pastMonth) / 1000);
  const to = Math.floor(+new Date(pastDay) / 1000);

  // todo params
  const params = { from, to, groupPeriod, chainId, month };

  const glpData = await getGlpData(params);

  const glpPerformanceData = await getGlpPerformanceData(glpData, params);

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
