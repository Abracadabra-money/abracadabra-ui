import axios from "axios";
import moment from "moment";
import { markRaw } from "vue";
import { SECONDS_PER_DAY } from "@/constants/global";
import type { ChartData } from "@/helpers/stake/types";
import { getGraphUrl } from "@/helpers/stake/magicApe/subgraph/getGraphUrl";

interface Snapshot {
  id: number;
  apr: string;
  apy: string;
}

type ResponseData = {
  apr: string;
  apy: string;
  date: string;
};

export const getYield = async (
  month = 1,
  chainId = 1
): Promise<ChartData | null> => {
  const days = 30 * month;
  const to = Math.floor(Date.now() / 1000 / SECONDS_PER_DAY);
  const from = to - days;

  const query = `{
        magicApeYieldDailySnapshots(
            first: ${days}
            where: {id_gte: ${from}, id_lte: ${to}}
            orderBy: id
            orderDirection: desc
        ) 
        {id apr apy}
    }`;

  try {
    const { data } = await axios.post(getGraphUrl(chainId), { query });
    const snapshots = data.data?.magicApeYieldDailySnapshots;

    const response: ResponseData[] = markRaw(
      snapshots.map((snapshot: Snapshot) => {
        return {
          apr: snapshot.apr,
          apy: snapshot.apy,
          date: moment.unix(snapshot.id * SECONDS_PER_DAY).format("YYYY-MM-DD"),
        };
      })
    );

    const reverseData = response!.reverse();

    const chartData = {
      labels: [] as string[],
      tickUpper1: [] as string[],
      tickUpper2: [] as string[],
    };

    reverseData.forEach((element: ResponseData) => {
      chartData.labels.push(moment(element.date).format("DD.MM"));
      chartData.tickUpper1.push(element.apy);
      chartData.tickUpper2.push(element.apr);
    });

    const dataset1 = {
      label: "MagicAPE",
      data: chartData.tickUpper1,
      borderColor: "#c0c53f",
      pointBackgroundColor: "#c0c53f",
      pointBorderColor: "#c0c53f",
      pointRadius: 0,
      borderWidth: 4,
    };

    const dataset2 = {
      label: "APE",
      data: chartData.tickUpper2,
      borderColor: "#495B7C",
      pointBackgroundColor: "#495B7C",
      pointBorderColor: "#495B7C",
      pointRadius: 0,
      borderWidth: 2,
    };

    return {
      labels: chartData.labels,
      datasets: [dataset1, dataset2],
    };
  } catch (error) {
    console.log("Get Yield Chart Data Error", error);
    return null;
  }
};
