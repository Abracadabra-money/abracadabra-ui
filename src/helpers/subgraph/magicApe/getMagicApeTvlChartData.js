import axios from "axios";
import moment from "moment";
import { getGraphUrl } from "@/helpers/subgraph/utils";

const getMagicApeTvlChartData = async (month = 1, chainId = 1) => {
  const secondsPerDay = 60 * 60 * 24;
  const days = 30 * month;
  const to = Math.floor(Date.now() / 1000 / secondsPerDay);
  const from = to - days;
  const url = getGraphUrl(chainId);

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
  const { data } = await axios.default.post(url, { query });
  const snapshots = data.data?.magicApeTvlDailySnapshots;

  const result = [];

  snapshots.forEach((snapshot) => {
    result.push({
      tvl: snapshot.totalValueLockedUsd,
      date: moment.unix(snapshot.id * secondsPerDay).format("YYYY-MM-DD"),
    });
  });

  return result;
};

export { getMagicApeTvlChartData };
