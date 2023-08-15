import axios from "axios";
import { sortBy } from "lodash";

const urls = {
  42161: "gmx-stats",
  43114: "gmx-avalanche-stats",
};

const fillNa = (arr: any) => {
  const prevValues: any = {};
  let keys: any;
  if (arr.length > 0) {
    keys = Object.keys(arr[0]);
    delete keys.timestamp;
    delete keys.id;
  }

  for (const el of arr) {
    for (const key of keys) {
      if (!el[key]) {
        if (prevValues[key as keyof typeof prevValues]) {
          el[key] = prevValues[key as keyof typeof prevValues];
        }
      } else {
        prevValues[key] = el[key];
      }
    }
  }
  return arr;
};

export const getGlpData = async ({ from, to, chainId = 42161 }: any) => {
  const url = urls[chainId as keyof typeof urls];
  const subgraphUrl = `https://api.thegraph.com/subgraphs/name/gmx-io/${url}`;
  const timestampProp = chainId === 42161 ? "id" : "timestamp";

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

  const { data } = await axios.post(subgraphUrl, { query });

  console.log("data", data);

  let { glpStats } = data.data;

  let glpStatsAvax: any;

  if (chainId === 43114) {
    const subQuery = `{
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
          distributedUsd
          distributedEth
        }
      }`;
    const _data = await axios.post(
      "https://api.studio.thegraph.com/query/4540/gmx-avax/v0.0.3",
      { query: subQuery }
    );
    glpStatsAvax = _data.data.data.glpStats;
  }

  if (glpStatsAvax && Array.isArray(glpStatsAvax)) {
    glpStats = glpStats.map((stat: any) => {
      for (const {
        distributedUsd,
        distributedEth,
        timestamp,
      } of glpStatsAvax) {
        const id = timestamp / 86400;
        const _id = stat.timestamp / 86400;
        if (id === _id) {
          stat.distributedUsd = distributedUsd;
          stat.distributedEth = distributedEth;
        }
      }
      return stat;
    });
  }

  let cumulativeDistributedUsdPerGlp = 0;
  let cumulativeDistributedEthPerGlp = 0;

  let prevGlpSupply: any;
  let prevAum: any;

  const ret = sortBy(glpStats, (item) => item[timestampProp])
    .filter((item) => item[timestampProp] % 86400 === 0)
    .reduce((memo, item) => {
      const last = memo[memo.length - 1];

      const aum = Number(item.aumInUsdg) / 1e18;
      const glpSupply = Number(item.glpSupply) / 1e18;

      // (distributedEth * priceEth) / 1e30
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
    .map((item: any) => {
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

  return fillNa(ret);
};
