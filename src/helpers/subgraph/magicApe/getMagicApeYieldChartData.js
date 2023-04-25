import axios from "axios";
import moment from "moment";
import { markRaw } from "vue";
import { getGraphUrl } from "@/helpers/subgraph/utils";

const getMagicApeYieldChartData = async (month = 1, chainId = 1) => {
  const secondsPerDay = 60 * 60 * 24;
  const days = 30 * month;
  const to = Math.floor(Date.now() / 1000 / secondsPerDay);
  const from = to - days;

  const url = getGraphUrl(chainId);

  const query = `{
        magicApeYieldDailySnapshots(
            first: ${days}
            where: {id_gte: ${from}, id_lte: ${to}}
            orderBy: id
            orderDirection: desc
        ) {
            id
            apr
            apy
        }
    }`;
  const { data } = await axios.default.post(url, { query });
  const snapshots = data.data?.magicApeYieldDailySnapshots;

  const result = [];

  snapshots.forEach((snapshot) => {
    result.push({
      apr: snapshot.apr,
      apy: snapshot.apy,
      date: moment.unix(snapshot.id * secondsPerDay).format("YYYY-MM-DD"),
    });
  });

  return markRaw(result);
};

export { getMagicApeYieldChartData };
