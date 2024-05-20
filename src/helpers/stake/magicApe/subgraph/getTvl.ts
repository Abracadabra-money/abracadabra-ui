import axios from "axios";
import moment from "moment";
import { markRaw } from "vue";
import { SECONDS_PER_DAY } from "@/constants/global";
import type { ChartData } from "@/helpers/stake/types";
import { getGraphUrl } from "@/helpers/stake/magicApe/subgraph/getGraphUrl";

interface Snapshot {
  id: string;
  totalValueLockedUsd: string;
}

type ResponseData = {
  tvl: string;
  date: string;
  [key: string]: string;
};

export const getTvl = async (
  type = "yield",
  month = 1,
  chainId = 1
): Promise<ChartData | null> => {
  const days = 30 * month;
  const to = Math.floor(Date.now() / 1000 / SECONDS_PER_DAY);
  const from = to - days;

  const query = `{
        magicApeTvlDailySnapshots(
            first: ${days}
            where: {id_gte: ${from}, id_lte: ${to}}
            orderBy: id
            orderDirection: desc
        ) {
            id
            totalValueLockedUsd
        }
    }`;

  try {
    const { data } = await axios.post(getGraphUrl(chainId), { query });
    const snapshots: Snapshot[] = data.data?.magicApeTvlDailySnapshots;

    const response: ResponseData[] = markRaw(
      snapshots.map((snapshot: Snapshot) => {
        return {
          tvl: snapshot.totalValueLockedUsd,
          date: moment
            .unix(Number(snapshot.id) * SECONDS_PER_DAY)
            .format("YYYY-MM-DD"),
        };
      })
    );

    const reverseData = response!.reverse();
    const chartData = { labels: [] as string[], tickUpper: [] as string[] };

    reverseData.forEach((element: ResponseData) => {
      chartData.labels.push(moment(element.date).format("DD.MM"));
      chartData.tickUpper.push(element[type.toLowerCase()]);
    });

    const dataset = {
      label: type.toUpperCase(),
      data: chartData.tickUpper,
      borderColor: "#c0c53f",
      pointBackgroundColor: "#c0c53f",
      pointBorderColor: "#c0c53f",
      pointRadius: 0,
      borderWidth: 2,
    };

    return {
      labels: chartData.labels,
      datasets: [dataset],
    };
  } catch (error) {
    console.log("Get TVL Chart Data Error", error);
    return null;
  }
};
