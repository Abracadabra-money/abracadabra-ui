import axios from "axios";
import type { FetchForkInfo } from "@/types/tenderly";
import { TENDERLY_GET_INFO_URL } from "@/constants/tenderly";

export const getForkInfo = async (
  forkUrl: string
): Promise<FetchForkInfo | null> => {
  const matches = forkUrl.match(/\/fork\/([a-z0-9-]+)/i);
  const forkId = matches && matches.length == 2 ? matches[1] : null;

  try {
    const { data } = await axios.get(`${TENDERLY_GET_INFO_URL}${forkId}`, {
      headers: {
        "X-Access-Key": import.meta.env.VITE_APP_TENDERLY_ACCESS_KEY,
      },
    });

    return data?.fork;
  } catch (error) {
    console.log("Get Fork Info Error:", error);
    return null;
  }
};
