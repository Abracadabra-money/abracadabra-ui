import axios from "axios";
import { getGraphUrl } from "./getGraphUrl";

export const getCauldronsInfo = async (chainId: number) => {
  const query = `query MyQuery {
    cauldrons {
      totalMimBorrowed
      totalValueLockedUsd
      borrowOpeningFee
      collateralPriceUsd
      collaterizationRate
      createdBlockNumber
      createdTimestamp
      cumulativeUniqueUsers
      deprecated
      exchangeRate
      id
      interestPerSecond
      isActive
      lastActive
      dailySnapshots {
        borrowFeesGenerated
        cumulativeUniqueUsers
        feesGenerated
        id
        interestFeesGenerated
        liquidationAmountUsd
        liquidationCount
        liquidationFeesGenerated
        repaidAmount
        timestamp
        totalCollateralShare
        totalMimBorrowed
        totalValueLockedUsd
      }
      liquidationAmountUsd
      liquidationCount
      liquidationMultiplier
      masterContract
      name
      oracle
      oracleData
      repaidAmount
      totalCollateralShare
      totalFeesGenerated
    }
  }`;

  const { data } = await axios.post(getGraphUrl(chainId), { query });
  return { chainId, data: data.data.cauldrons };
};
