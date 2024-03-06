import axios from "axios";
import type { Address } from "viem";

const GRAPHQL = "https://ymlcxloffmrsfereuhfa.supabase.co/graphql/v1?apikey=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltbGN4bG9mZm1yc2ZlcmV1aGZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk1NTM4MDMsImV4cCI6MjAyNTEyOTgwM30.hhfUPn4fw9WUdRpeXDIk6s5LskQ1HM4qMZy6G5AKjsk";

export const fetchPointsStatistics = async () => {
  try {
    const query = `{
        distributionAmountSum
        distributionAmountAvgSumForAddresses
      }`;

    const { data } = await axios.post(GRAPHQL, { query });

    return data.data;
  } catch (error) {
    console.log("Error fetching points statistics", error);
    return {
      distributionAmountSum: 0,
      distributionAmountAvgSumForAddresses: 0,
    };
  }
};

export const fetchUserPointsStatistics = async (
  address: Address
): Promise<number> => {
  if (!address) return 0;

  try {
    const query = `{
        distributionAmountSumByAddress(address: "${address.toLowerCase()}")
      }`;

    const { data } = await axios.post(GRAPHQL, { query });

    if (!data.data.distributionAmountSumByAddress) return 0;
    return Number(data.data.distributionAmountSumByAddress);
  } catch (error) {
    console.log("Error fetching user points statistics", error);
    return 0;
  }
};
