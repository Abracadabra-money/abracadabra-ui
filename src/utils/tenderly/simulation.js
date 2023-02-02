import axios from "axios";

const TENDERLY_ACCESS_KEY = process.env.VUE_APP_TENDERLY_ACCESS_KEY;
const TENDERLY_BASE_URL =
  "https://api.tenderly.co/api/v1/account/abracadabra/project/magic-internet-money/simulate";

let from;
let network_id;

export const configTenderly = (userAddr, chainId) => {
  from = userAddr;
  network_id = chainId;
};

export const tenderlySimulate = async (transactionParams) => {
  const opts = {
    headers: {
      "X-Access-Key": TENDERLY_ACCESS_KEY || "",
    },
  };

  return axios.post(
    TENDERLY_BASE_URL,
    { ...transactionParams, from, network_id },
    opts
  );
};
