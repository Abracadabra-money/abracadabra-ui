import axios from "axios";
import moment from "moment";
import { markRaw } from "vue";
import { SECONDS_PER_DAY } from "@/constants/global";
import { getGraphUrl } from "@/helpers/stake/magicApe/subgraph/getGraphUrl";

interface Snapshot {
  id: number;
  price: string;
}

type ResponseData = {
  price: string;
  date: string;
  [key: string]: string;
};

type PriceInfo = {
  labels: string[];
  datasets: {
    label: string;
    data: string[];
    borderColor: string;
    pointBackgroundColor: string;
    pointBorderColor: string;
    pointRadius: number;
    borderWidth: number;
  }[];
};

export const getPrice = async (
  type = "price",
  month = 1,
  chainId = 1
): Promise<PriceInfo | null> => {
  const days = 30 * month;
  const to = Math.floor(Date.now() / 1000 / SECONDS_PER_DAY);
  const from = to - days;

  const query = `{
        magicApePriceDailySnapshots(
            first: ${days}
            where: {id_gte: ${from}, id_lte: ${to}}
            orderBy: id
            orderDirection: desc
        ) {
            id
            price
        }
    }`;

  try {
    const { data } = await axios.post(getGraphUrl(chainId), { query });
    const snapshots: Snapshot[] = data.data?.magicApePriceDailySnapshots;

    const response: ResponseData[] = markRaw(
      snapshots.map((snapshot: Snapshot) => {
        return {
          price: snapshot.price,
          date: moment.unix(snapshot.id * SECONDS_PER_DAY).format("YYYY-MM-DD"),
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
