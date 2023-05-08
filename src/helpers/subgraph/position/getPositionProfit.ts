import axios from "axios";
import { utils } from "ethers";
const url = "https://api.studio.thegraph.com/query/4540/abra-test/v0.0.21/";

export const getPositionProfit = async (address: string) => {
  const query = `{
        account(id: "${address.toLowerCase()}") {
          id
          states {
            borrowPart
            collateralShare
            cauldron {
              id
              collateral {
                lastPriceUsd
                name
                decimals
              }
            }
            snapshots(orderBy: timestamp, orderDirection: asc) {
              withdrawAmountUsd
              repaidUsd
              collateralShare
              collateralPriceUsd
              borrowPart
            }
          }
        }
      }`;

  const { data } = await axios.post(url, { query });

  return data.data.account.states.map(
    ({ borrowPart, collateralShare, cauldron, snapshots }: any) => {
      if (+borrowPart === 0 && +collateralShare === 0) return 0;
      const { decimals, lastPriceUsd } = cauldron.collateral;

      const startCollateralUsd =
        +utils.formatUnits(snapshots[0].collateralShare, decimals) *
        +snapshots[0].collateralPriceUsd;

      const startBorrowUsd = +utils.formatUnits(snapshots[0].borrowPart, 18);

      const curentCollateralUsd =
        +utils.formatUnits(collateralShare, decimals) * lastPriceUsd;

      const curentBorrowUsd = +utils.formatUnits(borrowPart, 18);

      let withdrawUsd = 0;
      let repaidUsd = 0;

      for (let i = 1; i < snapshots.length; i++) {
        withdrawUsd = withdrawUsd + +snapshots[i].withdrawAmountUsd;
        repaidUsd = repaidUsd + +snapshots[i].repaidUsd;
      }

      const profit =
        curentCollateralUsd +
        withdrawUsd -
        (curentBorrowUsd + repaidUsd) -
        (startCollateralUsd - startBorrowUsd);

      return {
        ...cauldron,
        profit,
      };
    }
  );
};
