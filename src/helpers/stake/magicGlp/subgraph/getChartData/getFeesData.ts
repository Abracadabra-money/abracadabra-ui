import axios from "axios";
import { sortBy, chain, sumBy } from "lodash";

const urls = {
  42161: "gmx-stats",
  43114: "gmx-avalanche-stats",
};

const MOVING_AVERAGE_DAYS = 7;
const MOVING_AVERAGE_PERIOD = 86400 * MOVING_AVERAGE_DAYS;

const getGlpData = async ({ from, to, chainId = 42161 }: any) => {
  const url = urls[chainId as keyof typeof urls];
  const subgraphUrl = `https://api.thegraph.com/subgraphs/name/gmx-io/${url}`;

  const PROPS = "margin liquidation swap mint burn".split(" ");
  const query = `{
      feeStats(
        first: 1000
        orderBy: id
        orderDirection: desc
        where: { period: daily, id_gte: ${from}, id_lte: ${to} }
        subgraphError: allow
      ) {
        id
        margin
        marginAndLiquidation
        swap
        mint
        burn
        ${chainId === 43114 ? "timestamp" : ""}
      }
    }`;

  const { data } = await axios.post(subgraphUrl, { query });
  const { feeStats } = data.data;

  const chartData = sortBy(feeStats, "id").map((item) => {
    const ret: any = { timestamp: item.timestamp || item.id };

    PROPS.forEach((prop) => {
      if (item[prop]) {
        ret[prop as keyof typeof ret] = item[prop] / 1e30;
      }
    });

    ret.liquidation = item.marginAndLiquidation / 1e30 - item.margin / 1e30;
    ret.all = PROPS.reduce((memo, prop) => memo + ret[prop], 0);
    return ret;
  });

  let cumulative = 0;
  const cumulativeByTs: any = {};

  return chain(chartData)
    .groupBy((item) => item.timestamp)
    .map((values, timestamp) => {
      const all = sumBy(values, "all");
      cumulative += all;

      let movingAverageAll;
      const movingAverageTs = +timestamp - MOVING_AVERAGE_PERIOD;

      if (movingAverageTs in cumulativeByTs) {
        movingAverageAll =
          (cumulative -
            cumulativeByTs[movingAverageTs as keyof typeof cumulativeByTs]) /
          MOVING_AVERAGE_DAYS;
      }

      const ret = {
        timestamp: Number(timestamp),
        all,
        cumulative,
        movingAverageAll,
      };
      PROPS.forEach((prop) => {
        ret[prop as keyof typeof ret] = sumBy(values, prop);
      });
      cumulativeByTs[timestamp] = cumulative;
      return ret;
    })
    .value()
    .filter((item) => item.timestamp >= from);
};

export default getGlpData;
