import axios from "axios";
import { sortBy } from "lodash";
import { magicGlpConfig } from "@/configs/stake/magicGlpConfig";

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

  const { timestampProp } =
    magicGlpConfig[chainId as keyof typeof magicGlpConfig].additionalInfo;

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
      }
    }`;

  const { data } = await axios.post(subgraphUrl, { query });

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
        }
      }`;

    const { data } = await axios.post(
      "https://api.studio.thegraph.com/query/4540/gmx-avax/v0.0.3",
      { query: subQuery }
    );

    glpStatsAvax = data.data.glpStats;
  }

  if (glpStatsAvax && Array.isArray(glpStatsAvax)) {
    glpStats = glpStats.map((stat: any) => {
      for (const { distributedUsd, timestamp } of glpStatsAvax) {
        const id = timestamp / 86400;
        const _id = stat.timestamp / 86400;

        if (id === _id) stat.distributedUsd = distributedUsd;
      }
      return stat;
    });
  }

  let cumulativeDistributedUsdPerGlp = 0;

  const ret = sortBy(glpStats, (item: any) => item[timestampProp])
    .filter((item: any) => item[timestampProp] % 86400 === 0)
    .reduce((memo: any, currentItem: any) => {
      const last = memo[memo.length - 1];

      const aum = Number(currentItem.aumInUsdg) / 1e18;
      const glpSupply = Number(currentItem.glpSupply) / 1e18;

      const distributedUsd = Number(currentItem.distributedUsd) / 1e30;
      const distributedUsdPerGlp = distributedUsd / glpSupply || 0;
      cumulativeDistributedUsdPerGlp += distributedUsdPerGlp;

      const glpPrice = aum / glpSupply;
      const timestamp = parseInt(currentItem[timestampProp]);

      const newItem = {
        timestamp,
        glpPrice,
        cumulativeDistributedUsdPerGlp,
        distributedUsdPerGlp,
      };

      if (last && last.timestamp === timestamp) {
        memo[memo.length - 1] = newItem;
      } else {
        memo.push(newItem);
      }

      return memo;
    }, []);

  return fillNa(ret);
};
