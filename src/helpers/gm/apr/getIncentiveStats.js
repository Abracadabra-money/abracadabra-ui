import axios from "axios";
import { INCENTIVE_STATS_URL } from "@/constants/gm";

export const fetchIncentiveStats = async () => {
  try {
    const { data } = await axios.get(INCENTIVE_STATS_URL);
    return data;
  } catch (error) {
    console.log("fetchIncentiveStats err:", error);
  }
};
