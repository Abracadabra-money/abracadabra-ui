import axios from "axios";

const subgraphUrl =
  "https://api.thegraph.com/subgraphs/name/0xfantaholic/abra-bsc";

import { getFeeApy } from "./getFeeApy";

export const getMagicLvlStatistics = async () => {
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
    levelFinanceDailySnapshots(first: 1, orderDirection: desc, orderBy: timestamp) {
          seniorApy
          mezzanineApy
          juniorApy
          timestamp
        }
  }`;

  const { data } = await axios.post(subgraphUrl, { query });
  const { juniorApy, mezzanineApy, seniorApy, timestamp } =
    data.data.levelFinanceDailySnapshots[0];

  const { junior, mezzanine, senior } = data.data.levelFinances[0];

  const { juniorFeeApy, mezzanineFeeApy, seniorFeeApy } = await getFeeApy(
    timestamp
  );

  return {
    juniorApy: +juniorApy + juniorFeeApy,
    mezzanineApy: +mezzanineApy + mezzanineFeeApy,
    seniorApy: +seniorApy + seniorFeeApy,
    junior,
    mezzanine,
    senior,
  };
};
