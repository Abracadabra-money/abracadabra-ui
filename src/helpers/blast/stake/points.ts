import axios from "axios";
import type { Address } from "viem";

const GRAPHQL = "https://daring-mongoose-83.hasura.app/v1/graphql";

export const fetchPointsStatistics = async () => {
  try {
    const query = `{
        point_aggregation {
          total_points_earned
          average_points_earned
        }
      }`;

    const { data } = await axios.post(GRAPHQL, { query });

    return data.data.point_aggregation[0];
  } catch (error) {
    console.log("Error fetching points statistics", error);
    return {
      average_points_earned: 0,
      total_points_earned: 0,
    };
  }
};

export const fetchUserPointsStatistics = async (
  address: Address
): Promise<number> => {
  if (!address) return 0;

  try {
    const query = `{
        points_by_pk(address: "${address.toLowerCase()}") {
          points_earned
        }
      }`;

    const { data } = await axios.post(GRAPHQL, { query });

    if (!data.data.points_by_pk) return 0;
    return data.data.points_by_pk.points_earned;
  } catch (error) {
    console.log("Error fetching user points statistics", error);
    return 0;
  }
};
