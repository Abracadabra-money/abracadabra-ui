import axios from "axios";
import { getGraphUrl } from "@/helpers/subgraph/utils";

const getMagicApeTotalRewards = async (chainId = 1) => {
  const url = getGraphUrl(chainId);
  const query = `{
        magicApe(id: "0xf35b31b941d94b249eaded041db1b05b7097feb6") {
            totalRewards
        }
    }`;
  const { data } = await axios.default.post(url, { query });

  return data.data.magicApe?.totalRewards;
};

export { getMagicApeTotalRewards };
