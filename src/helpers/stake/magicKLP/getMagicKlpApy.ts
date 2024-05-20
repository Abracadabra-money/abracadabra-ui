import axios from "axios";
import moment from "moment";
import { ANALYTICS_URK } from "@/constants/global";
import type { ChartData } from "@/helpers/stake/types";

export const getMagicKlpApy = async (period = 1): Promise<ChartData> => {
  const { data } = await axios.get(`${ANALYTICS_URK}/kinetix/info`);

  const chartData = { labels: [] as string[], tickUpper: [] as number[] };

  let date: string = "";
  let apr: number = 0;
  let count: number = 0;

  data.chart.forEach(
    (element: { date: string; apr: number }, index: number) => {
      if (!date) {
        date = moment(element.date).format("DD.MM");
        apr = element.apr;
        count = 1;
      } else if (date === moment(element.date).format("DD.MM")) {
        apr += element.apr;
        count++;
      } else {
        chartData.labels.push(date);
        chartData.tickUpper.push(apr / count);
        date = moment(element.date).format("DD.MM");
        apr = element.apr;
        count = 1;
      }

      if (data.chart.length - 1 === index) {
        chartData.labels.push(date);
        chartData.tickUpper.push(apr / count);
      }
    }
  );

  return {
    labels: [...chartData.labels.reverse().slice(-30 * period)],
    datasets: [
      {
        label: "APY",
        data: [...chartData.tickUpper.reverse().slice(-30 * period)],
        borderColor: "#73b6f6 ",
        pointBackgroundColor: "#73b6f6",
        pointBorderColor: "#73b6f6",
        pointRadius: 0,
        borderWidth: 2,
      },
    ],
  };
};
