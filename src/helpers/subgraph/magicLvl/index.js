import axios from "axios";

const subgraphUrl =
  "https://api.thegraph.com/subgraphs/name/0xfantaholic/abra-bsc";

//   getLevelFinanceStatistics
export const getLevelFinanceStatistics = async () => {
  const query = `{
    levelFinances {
      junior {
        totalRewards
        lpPriceUsd
      }
      mezzanine {
        lpPriceUsd
        totalRewards
      }
      senior {
        lpPriceUsd
        totalRewards
      }
    }
    levelFinanceDailySnapshots(first: 1, orderDirection: asc, orderBy: timestamp) {
          seniorApy
          mezzanineApy
          juniorApy
          timestamp
        }
  }`;

  const { data } = await axios.default.post(subgraphUrl, { query });
  const { juniorApy, mezzanineApy, seniorApy } =
    data.data.levelFinanceDailySnapshots[0];

  const { junior, mezzanine, senior } = data.data.levelFinances[0];

  return { juniorApy, mezzanineApy, seniorApy, junior, mezzanine, senior };
};
