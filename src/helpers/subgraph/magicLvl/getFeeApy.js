import axios from "axios";
import { utils, BigNumber } from "ethers";
import {
  JUNIOR_LLP_ADDRESS,
  MEZZANINE_LLP_ADDRESS,
  SENIOR_LLP_ADDRESS,
  SUBGRAPH_URL,
  BLOCK_NUMBER_URL,
} from "@/constants/lvlFinance";

export const getBlockNumberByTimestamp = async (timestamp) => {
  const query = `{
    blocks(
      where: {timestamp_lte: "${timestamp}"}
      orderBy: timestamp
      orderDirection: desc
      first: 1
    ) {
      number
      timestamp
    }
  }`;

  const { data } = await axios.default.post(BLOCK_NUMBER_URL, { query });
  const blockNumber = data.data.blocks[0].number;

  return blockNumber;
};

export const getFeeApy = async (currentTimestamp) => {
  const timestamp = currentTimestamp - 86400 * 7; // 7 days ago in Unix timestamp
  const blockNumber = await getBlockNumberByTimestamp(timestamp);

  const query = `{
    prior: tranches(block: {number: ${blockNumber}}) {
      id
      totalFeeValue
      llpPrice
      llpSupply
    }
    current: tranches {
      id
      totalFeeValue
      llpPrice
      llpSupply
    }
  }`;

  const { data } = await axios.default.post(SUBGRAPH_URL, { query });

  const juniorInfo = {
    currentAmount: data.data.current.find(
      (item) => item.id.toLowerCase() === JUNIOR_LLP_ADDRESS.toLowerCase()
    ),
    prior: data.data.prior.find(
      (item) => item.id.toLowerCase() === JUNIOR_LLP_ADDRESS.toLowerCase()
    ),
  };

  const mezzanineInfo = {
    currentAmount: data.data.current.find(
      (item) => item.id.toLowerCase() === MEZZANINE_LLP_ADDRESS.toLowerCase()
    ),
    prior: data.data.prior.find(
      (item) => item.id.toLowerCase() === MEZZANINE_LLP_ADDRESS.toLowerCase()
    ),
  };

  const seniorInfo = {
    currentAmount: data.data.current.find(
      (item) => item.id.toLowerCase() === SENIOR_LLP_ADDRESS.toLowerCase()
    ),
    prior: data.data.prior.find(
      (item) => item.id.toLowerCase() === SENIOR_LLP_ADDRESS.toLowerCase()
    ),
  };

  const juniorFeeApy = computeApy(juniorInfo);
  const mezzanineFeeApy = computeApy(mezzanineInfo);
  const seniorFeeApy = computeApy(seniorInfo);

  return {
    juniorFeeApy,
    mezzanineFeeApy,
    seniorFeeApy,
  };
};

const computeApy = (info) => {
  const fees = utils.formatUnits(
    BigNumber.from(info.currentAmount.totalFeeValue).sub(
      BigNumber.from(info.prior.totalFeeValue)
    ),
    30
  );

  const price = utils.formatUnits(info.currentAmount.llpPrice, 12);

  const feesValue = fees * price;

  const percent = feesValue / utils.formatUnits(info.currentAmount.llpSupply);

  const apy = percent * 366 * 10;

  return apy;
};
