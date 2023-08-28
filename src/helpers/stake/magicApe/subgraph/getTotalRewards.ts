import axios from "axios";
import { getGraphUrl } from "@/helpers/stake/magicApe/subgraph/getGraphUrl";

export const getTotalRewards = async (chainId = 1): Promise<String> => {
  const url = getGraphUrl(chainId);
  const query = `{
        magicApe(id: "0xf35b31b941d94b249eaded041db1b05b7097feb6") {
            totalRewards
        }
    }`;

  try {
    const { data } = await axios.post(url, { query });
    return data.data.magicApe?.totalRewards;
  } catch (error) {
    console.log("Get Total Rewards Error", error);
    return "0";
  }
};
