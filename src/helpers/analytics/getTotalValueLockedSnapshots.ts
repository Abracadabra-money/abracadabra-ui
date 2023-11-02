import axios from "axios";
import { getGraphUrl } from "./getGraphUrl";

const defaultChains = [1, 10, 250, 42161, 43114];

export const getTotalValueLockedSnapshots = async (
  first = 1000,
  skip = 0,
  count = 0,
  data: any = []
): Promise<any> => {
  const query = `query MyQuery {
        protocols {
          dailySnapshots(first: ${first}, skip: ${skip}) {
            timestamp
            totalValueLockedUsd
          }
        }
      }`;

  data.push(
    await Promise.all(
      defaultChains.map(async (chainId: number) => {
        const url = getGraphUrl(chainId);
        const { data } = await axios.post(url, { query: query });

        return {
          chainId,
          snapshots: data.data.protocols[0].dailySnapshots || [],
        };
      })
    )
  );

  const isNextRequest = data[count].some(({ snapshots }: any) => {
    return snapshots.length >= first;
  });

  if (isNextRequest) {
    count++;
    return await getTotalValueLockedSnapshots(
      first,
      first * count,
      count,
      data
    );
  } else {
    return await data.reduce((accumulator: any, currentItem: any) => {
      return accumulator.map((item: any, index: number) => {
        return {
          chainId: item.chainId,
          snapshots: [...item.snapshots, ...currentItem[index].snapshots],
        };
      });
    });
  }
};
