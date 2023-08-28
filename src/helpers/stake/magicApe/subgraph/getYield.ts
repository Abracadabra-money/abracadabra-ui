import axios from "axios";
import moment from "moment";
import { markRaw } from "vue";
import { SECONDS_PER_DAY } from "@/constants/global";
import { getGraphUrl } from "@/helpers/stake/magicApe/subgraph/getGraphUrl";
import type { GetYield } from "@/helpers/stake/magicApe/subgraph/types";

export const getYield = async (
  month = 1,
  chainId = 1
): Promise<GetYield[] | null> => {
  const days = 30 * month;
  const to = Math.floor(Date.now() / 1000 / SECONDS_PER_DAY);
  const from = to - days;

  const query = `{
        magicApeYieldDailySnapshots(
            first: ${days}
            where: {id_gte: ${from}, id_lte: ${to}}
            orderBy: id
            orderDirection: desc
        ) 
        {id apr apy}
    }`;

  try {
    const { data } = await axios.post(getGraphUrl(chainId), { query });
    const snapshots = data.data?.magicApeYieldDailySnapshots;

    return markRaw(
      snapshots.map((snapshot: any) => {
        return {
          apr: snapshot.apr,
          apy: snapshot.apy,
          date: moment.unix(snapshot.id * SECONDS_PER_DAY).format("YYYY-MM-DD"),
        };
      })
    );
  } catch (error) {
    console.log("Get Yield Chart Data Error", error);
    return null;
  }
};
