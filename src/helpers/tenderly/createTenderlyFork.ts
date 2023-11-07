import axios from "axios";
import type { LocalForkData } from "@/types/tenderly";
import { TENDERLY_BASE_URL } from "@/constants/tenderly";

export const createTenderlyFork = async (
  network_id: number
): Promise<LocalForkData | null> => {
  try {
    const { data } = await axios.post(
      `${TENDERLY_BASE_URL}/fork`,
      { network_id },
      {
        headers: {
          "X-Access-Key": import.meta.env.VITE_APP_TENDERLY_ACCESS_KEY,
        },
      }
    );

    return {
      forkId: data.root_transaction.fork_id,
      rpcUrl: data.simulation_fork.rpc_url,
      timestamp: data.root_transaction.timestamp,
      forkChainId: +data.root_transaction.network_id,
      useFork: false,
    };
  } catch (error) {
    console.log("Create Tenderly Fork Error:", error);
    return null;
  }
};
