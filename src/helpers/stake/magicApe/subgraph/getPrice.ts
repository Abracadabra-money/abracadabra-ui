import axios from "axios";
import moment from "moment";
import { markRaw } from "vue";
import { SECONDS_PER_DAY } from "@/constants/global";
import { getGraphUrl } from "@/helpers/stake/magicApe/subgraph/getGraphUrl";

export const getPrice = async (type = "price", month = 1, chainId = 1) => {
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
    const snapshots = data.data?.magicApePriceDailySnapshots;

    const response = markRaw(
      snapshots.map((snapshot: any) => {
        return {
          price: snapshot.price,
          date: moment.unix(snapshot.id * SECONDS_PER_DAY).format("YYYY-MM-DD"),
        };
      })
    );

    const reverseData: any = response!.reverse();
    const chartData: any = { labels: [], tickUpper: [] };

    reverseData.forEach((element: any) => {
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
