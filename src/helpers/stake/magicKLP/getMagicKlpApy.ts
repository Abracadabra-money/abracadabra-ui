import axios from "axios";
import moment from "moment";
import { ANALYTICS_URK } from "@/constants/global";

export const getMagicKlpApy = async () => {
  const { data }: any = await axios.get(`${ANALYTICS_URK}/kinetix/info`);

  const chartData: any = { labels: [], tickUpper: [] };

  data.chart.forEach((element: any) => {
    chartData.labels.push(moment(element.date).format("DD.MM"));
    chartData.tickUpper.push(element.apr);
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
