import axios from "axios";
import moment from "moment";
import { getGraphUrl } from "@/helpers/subgraph/utils";

const getMagicApePriceChartData = async (month = 1, chainId = 1) => {
  const secondsPerDay = 60 * 60 * 24;
  const days = 30 * month;
  const to = Math.floor(Date.now() / 1000 / secondsPerDay);
  const from = to - days;
  const url = getGraphUrl(chainId);

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
  const { data } = await axios.default.post(url, { query });

  const snapshots = data.data?.magicApePriceDailySnapshots;

  const result = [];

  snapshots.forEach((snapshot) => {
    result.push({
      price: snapshot.price,
      date: moment.unix(snapshot.id * secondsPerDay).format("YYYY-MM-DD"),
    });
  });

  return result;
};

export { getMagicApePriceChartData };
