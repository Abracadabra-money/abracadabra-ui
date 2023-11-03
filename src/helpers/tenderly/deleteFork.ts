import axios from "axios";
import { TENDERLY_BASE_URL } from "@/constants/tenderly";

export const deleteFork = async (forkId: number): Promise<void> => {
  try {
    await axios.delete(`${TENDERLY_BASE_URL}/fork/${forkId}`, {
      headers: {
        "X-Access-Key": import.meta.env.VITE_APP_TENDERLY_ACCESS_KEY,
      },
    });
  } catch (error) {
    console.log("Error Delete Fork", error);
  }
};
