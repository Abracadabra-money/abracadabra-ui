import axios from "axios";
import { utils, BigNumber } from "ethers";

const subgraphUrl =
  "https://api.thegraph.com/subgraphs/name/level-fi/levelfinanceanalytics";
const blockNumberUrl =
  "https://api.thegraph.com/subgraphs/name/wombat-exchange/bnb-chain-block";

const JUNIOR = "0xcc5368f152453d497061cb1fb578d2d3c54bd0a0";
const MEZZANINE = "0x4265af66537F7BE1Ca60Ca6070D97531EC571BDd";
const SENIOR = "0xb5c42f84ab3f786bca9761240546aa9cec1f8821";

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

  const { data } = await axios.default.post(blockNumberUrl, { query });
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

  const { data } = await axios.default.post(subgraphUrl, { query });


  const juniorInfo = {
    currentAmount: data.data.current.find(
      (item) => item.id.toLowerCase() === JUNIOR.toLowerCase()
    ),
    prior: data.data.prior.find(
      (item) => item.id.toLowerCase() === JUNIOR.toLowerCase()
    ),
  };

  const mezzanineInfo = {
    currentAmount: data.data.current.find(
      (item) => item.id.toLowerCase() === MEZZANINE.toLowerCase()
    ),
    prior: data.data.prior.find(
      (item) => item.id.toLowerCase() === MEZZANINE.toLowerCase()
    ),
  };

  const seniorInfo = {
    currentAmount: data.data.current.find(
      (item) => item.id.toLowerCase() === SENIOR.toLowerCase()
    ),
    prior: data.data.prior.find(
      (item) => item.id.toLowerCase() === SENIOR.toLowerCase()
    ),
  };

  const juniorFeeApy = computeApy(juniorInfo);
  const mezzanineFeeApy = computeApy(mezzanineInfo);
  const seniorFeeApy = computeApy(seniorInfo);

  return {
    juniorFeeApy,
    mezzanineFeeApy,
    seniorFeeApy
  }
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