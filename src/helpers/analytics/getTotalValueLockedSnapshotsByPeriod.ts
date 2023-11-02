import axios from "axios";
import { getGraphUrl } from "./getGraphUrl";

const defaultChains = [1, 10, 250, 42161, 43114];

export const getTotalValueLockedSnapshotsByPeriod = async (
  first = 1000,
  orderDirection = "desc",
  orderBy = "timestamp"
): Promise<any> => {
  const query = `query MyQuery {
    protocols {
      dailySnapshots(first: ${first}, orderDirection: ${orderDirection}, orderBy: ${orderBy}) {
        totalValueLockedUsd
        timestamp
      }
    }
  }`;

  return await Promise.all(
    defaultChains.map(async (chainId: number) => {
      const url = getGraphUrl(chainId);
      const { data } = await axios.post(url, { query: query });

      return {
        chainId,
        snapshots: data.data.protocols[0].dailySnapshots || [],
      };
    })
  );
};
