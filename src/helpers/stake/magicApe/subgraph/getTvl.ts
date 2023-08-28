import axios from "axios";
import moment from "moment";
import { markRaw } from "vue";
import { SECONDS_PER_DAY } from "@/constants/global";
import type { GetTvl } from "@/helpers/stake/magicApe/subgraph/types";
import { getGraphUrl } from "@/helpers/stake/magicApe/subgraph/getGraphUrl";

export const getTvl = async (
  month = 1,
  chainId = 1
): Promise<GetTvl[] | null> => {
  const days = 30 * month;
  const to = Math.floor(Date.now() / 1000 / SECONDS_PER_DAY);
  const from = to - days;

  const query = `{
        magicApeTvlDailySnapshots(
            first: ${days}
            where: {id_gte: ${from}, id_lte: ${to}}
            orderBy: id
            orderDirection: desc
        ) {
            id
            totalValueLockedUsd
        }
    }`;

  try {
    const { data } = await axios.post(getGraphUrl(chainId), { query });
    const snapshots = data.data?.magicApeTvlDailySnapshots;

    return markRaw(
      snapshots.map((snapshot: any) => {
        return {
          tvl: snapshot.totalValueLockedUsd,
          date: moment.unix(snapshot.id * SECONDS_PER_DAY).format("YYYY-MM-DD"),
        };
      })
    );
  } catch (error) {
    console.log("Get TVL Chart Data Error", error);
    return null;
  }
};
