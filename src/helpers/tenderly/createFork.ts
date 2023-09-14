import axios from "axios";
import { TENDERLY_URL } from "@/constants/tenderly";

export const createFork = async (network_id: number) => {
  try {
    const { data } = await axios.post(
      TENDERLY_URL,
      { network_id },
      {
        headers: {
          "X-Access-Key": import.meta.env.VITE_APP_TENDERLY_ACCESS_KEY,
        },
      }
    );

    const { root_transaction } = data;

    console.log(data);

    return {
      forkId: root_transaction.fork_id,
      timestamp: root_transaction.timestamp,
      forkChainId: +root_transaction.network_id,
      useFork: false,
    };
  } catch (error) {
    console.log("Create Tenderly Fork Error:", error);
  }
};
