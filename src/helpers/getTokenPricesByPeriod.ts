// import axios from "axios";
// import { getGraphUrl } from "@/helpers/getGraphUrl";
// import moment from "moment";

import btcPrices from "@/utils/magicGlp/btcPrices";
import avaxPrices from "@/utils/magicGlp/avaxPrices";

// export const getTokenPricesByPeriod = async (
//   collateralAddress: string,
//   period: number = 30,
//   chainId: number = 1,
//   orderDirection = "desc",
//   orderBy = "timestamp"
// ) => {
//   const query = `query MyQuery {
//         collateral(id: "${collateralAddress}") {
//           dailySnapshots(first: ${period}, orderDirection: ${orderDirection}, orderBy: ${orderBy}) {

//             timestamp
//             lastPriceUsd
//           }
//         }
//       }`;

//   console.log("query", query);

//   const { data } = await axios.post(getGraphUrl(chainId), { query: query });

//   return data.data.collateral.dailySnapshots.map(
//     ({ timestamp, lastPriceUsd }: any) => {
//       return {
//         timestamp,
//         value: +lastPriceUsd,
//       };
//     }
//   );
// };

export const getTokenPricesByPeriod = async (
  collateralAddress: string,
  period: number = 1
) => {
  console.log("period", period);

  let historicalData: any = null;

  if (collateralAddress === "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599") {
    historicalData = btcPrices;
  }

  if (collateralAddress === "0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7") {
    historicalData = avaxPrices;
  }

  if (period === 12) return historicalData;
  return [...historicalData].splice(historicalData?.length - period * 31);
};
