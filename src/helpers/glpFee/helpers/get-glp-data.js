import axios from "axios";
import { sortBy } from "lodash";

function fillNa(arr) {
  const prevValues = {};
  let keys;
  if (arr.length > 0) {
    keys = Object.keys(arr[0]);
    delete keys.timestamp;
    delete keys.id;
  }

  for (const el of arr) {
    for (const key of keys) {
      if (!el[key]) {
        if (prevValues[key]) {
          el[key] = prevValues[key];
        }
      } else {
        prevValues[key] = el[key];
      }
    }
  }
  return arr;
}

export const getGlpData = async ({ from, to }) => {
  const subgraphUrl =
    "https://api.thegraph.com/subgraphs/name/gmx-io/gmx-stats";
  const timestampProp = "id";

  const query = `{
        glpStats(
          first: 1000
          orderBy: ${timestampProp}
          orderDirection: desc
          where: {
            period: daily
            ${timestampProp}_gte: ${from}
            ${timestampProp}_lte: ${to}
          }
          subgraphError: allow
        ) {
          ${timestampProp}
          aumInUsdg
          glpSupply
          distributedUsd
          distributedEth
        }
      }`;

  const { data } = await axios.default.post(subgraphUrl, { query });
  const { glpStats } = data.data;

  let cumulativeDistributedUsdPerGlp = 0;
  let cumulativeDistributedEthPerGlp = 0;

  let prevGlpSupply;
  let prevAum;

  let ret = sortBy(glpStats, (item) => item[timestampProp])
    .filter((item) => item[timestampProp] % 86400 === 0)
    .reduce((memo, item) => {
      const last = memo[memo.length - 1];

      const aum = Number(item.aumInUsdg) / 1e18;
      const glpSupply = Number(item.glpSupply) / 1e18;

      const distributedUsd = Number(item.distributedUsd) / 1e30;
      const distributedUsdPerGlp = distributedUsd / glpSupply || 0;
      cumulativeDistributedUsdPerGlp += distributedUsdPerGlp;

      const distributedEth = Number(item.distributedEth) / 1e18;
      const distributedEthPerGlp = distributedEth / glpSupply || 0;
      cumulativeDistributedEthPerGlp += distributedEthPerGlp;

      const glpPrice = aum / glpSupply;
      const timestamp = parseInt(item[timestampProp]);

      const newItem = {
        timestamp,
        aum,
        glpSupply,
        glpPrice,
        cumulativeDistributedEthPerGlp,
        cumulativeDistributedUsdPerGlp,
        distributedUsdPerGlp,
        distributedEthPerGlp,
      };

      if (last && last.timestamp === timestamp) {
        memo[memo.length - 1] = newItem;
      } else {
        memo.push(newItem);
      }

      return memo;
    }, [])
    .map((item) => {
      let { glpSupply, aum } = item;
      if (!glpSupply) {
        glpSupply = prevGlpSupply;
      }
      if (!aum) {
        aum = prevAum;
      }
      item.glpSupplyChange = prevGlpSupply
        ? ((glpSupply - prevGlpSupply) / prevGlpSupply) * 100
        : 0;
      if (item.glpSupplyChange > 1000) {
        item.glpSupplyChange = 0;
      }
      item.aumChange = prevAum ? ((aum - prevAum) / prevAum) * 100 : 0;
      if (item.aumChange > 1000) {
        item.aumChange = 0;
      }
      prevGlpSupply = glpSupply;
      prevAum = aum;
      return item;
    });

  ret = fillNa(ret);
  return ret;
};
