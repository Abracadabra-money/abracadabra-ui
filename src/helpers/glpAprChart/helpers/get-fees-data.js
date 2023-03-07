const axios = require("axios");
const { sortBy, chain, sumBy } = require("lodash");

const MOVING_AVERAGE_DAYS = 7;
const MOVING_AVERAGE_PERIOD = 86400 * MOVING_AVERAGE_DAYS;

const getGlpData = async ({ from, to }) => {
  const subgraphUrl =
    "https://api.thegraph.com/subgraphs/name/gmx-io/gmx-stats";

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
        }
    }`;

  const { data } = await axios.default.post(subgraphUrl, { query });
  const { feeStats } = data.data;

  let chartData = sortBy(feeStats, "id").map((item) => {
    const ret = { timestamp: item.timestamp || item.id };

    PROPS.forEach((prop) => {
      if (item[prop]) {
        ret[prop] = item[prop] / 1e30;
      }
    });

    ret.liquidation = item.marginAndLiquidation / 1e30 - item.margin / 1e30;
    ret.all = PROPS.reduce((memo, prop) => memo + ret[prop], 0);
    return ret;
  });

  let cumulative = 0;
  const cumulativeByTs = {};

  return chain(chartData)
    .groupBy((item) => item.timestamp)
    .map((values, timestamp) => {
      const all = sumBy(values, "all");
      cumulative += all;

      let movingAverageAll;
      const movingAverageTs = timestamp - MOVING_AVERAGE_PERIOD;
      if (movingAverageTs in cumulativeByTs) {
        movingAverageAll =
          (cumulative - cumulativeByTs[movingAverageTs]) / MOVING_AVERAGE_DAYS;
      }

      const ret = {
        timestamp: Number(timestamp),
        all,
        cumulative,
        movingAverageAll,
      };
      PROPS.forEach((prop) => {
        ret[prop] = sumBy(values, prop);
      });
      cumulativeByTs[timestamp] = cumulative;
      return ret;
    })
    .value()
    .filter((item) => item.timestamp >= from);
};

module.exports = getGlpData;
