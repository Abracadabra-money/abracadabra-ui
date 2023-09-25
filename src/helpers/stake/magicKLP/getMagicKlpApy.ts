import axios from "axios";
import moment from "moment";
import { ANALYTICS_URK } from "@/constants/global";

export const getMagicKlpApy = async () => {
  const { data }: any = await axios.get(`${ANALYTICS_URK}/kinetix/info`);

  const chartData: any = { labels: [], tickUpper: [] };

  let date: any = null;
  let apr: any = null;
  let count: any = null;

  data.chart.forEach((element: any, index: any) => {
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

    console.log("index", index);

    if (data.chart.length - 1 === index) {
      chartData.labels.push(date);
      chartData.tickUpper.push(apr / count);
    }
  });

  return {
    labels: chartData.labels.reverse(),
    datasets: [
      {
        label: "APY",
        data: chartData.tickUpper.reverse(),
        borderColor: "#73b6f6 ",
        pointBackgroundColor: "#73b6f6",
        pointBorderColor: "#73b6f6",
        pointRadius: 0,
        borderWidth: 2,
      },
    ],
  };
};
