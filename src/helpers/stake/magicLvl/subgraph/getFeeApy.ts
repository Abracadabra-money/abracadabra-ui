import axios from "axios";
import { utils, BigNumber } from "ethers";
import {
  JUNIOR_LLP_ADDRESS,
  MEZZANINE_LLP_ADDRESS,
  SENIOR_LLP_ADDRESS,
  SUBGRAPH_URL,
  BLOCK_NUMBER_URL,
} from "@/constants/lvlFinance";

export const getBlockNumberByTimestamp = async (timestamp: any) => {
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

  const { data } = await axios.post(BLOCK_NUMBER_URL, { query });
  return data.data.blocks[0].number;
};

export const getFeeApy = async (currentTimestamp: any) => {
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

  const { data } = await axios.post(SUBGRAPH_URL, { query });

  const juniorInfo = {
    currentAmount: data.data.current.find(
      (item: any) => item.id.toLowerCase() === JUNIOR_LLP_ADDRESS.toLowerCase()
    ),
    prior: data.data.prior.find(
      (item: any) => item.id.toLowerCase() === JUNIOR_LLP_ADDRESS.toLowerCase()
    ),
  };

  const mezzanineInfo = {
    currentAmount: data.data.current.find(
      (item: any) =>
        item.id.toLowerCase() === MEZZANINE_LLP_ADDRESS.toLowerCase()
    ),
    prior: data.data.prior.find(
      (item: any) =>
        item.id.toLowerCase() === MEZZANINE_LLP_ADDRESS.toLowerCase()
    ),
  };

  const seniorInfo = {
    currentAmount: data.data.current.find(
      (item: any) => item.id.toLowerCase() === SENIOR_LLP_ADDRESS.toLowerCase()
    ),
    prior: data.data.prior.find(
      (item: any) => item.id.toLowerCase() === SENIOR_LLP_ADDRESS.toLowerCase()
    ),
  };

  return {
    juniorFeeApy: computeApy(juniorInfo),
    mezzanineFeeApy: computeApy(mezzanineInfo),
    seniorFeeApy: computeApy(seniorInfo),
  };
};

const computeApy = (info: any) => {
  const fees = +utils.formatUnits(
    BigNumber.from(info.currentAmount.totalFeeValue).sub(
      BigNumber.from(info.prior.totalFeeValue)
    ),
    30
  );

  const price = +utils.formatUnits(info.currentAmount.llpPrice, 12);
  const feesValue = fees * price;
  const percent = feesValue / +utils.formatUnits(info.currentAmount.llpSupply);
  return percent * 366 * 10;
};
