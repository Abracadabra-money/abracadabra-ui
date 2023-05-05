import axios from "axios";
const url = "https://api.studio.thegraph.com/query/4540/abra-test/v0.0.21/";

export const getPositionProfit = async (address: string) => {
  const query = `{
        account(id: "${address.toLowerCase()}") {
          id
          states {
            id
            borrowPart
            collateralShare
            cauldron {
              name
              id
              collateral {
                lastPriceUsd
                name
                symbol
              }
            }
            snapshots(orderBy: timestamp, orderDirection: desc) {
              withdrawAmountUsd
              withdrawAmount
              timestamp
              repaid
              repaidUsd
              liquidationPrice
              isLiquidated
              id
              hash
              collateralShare
              collateralPriceUsd
              borrowPart
              blockNumber
            }
            lastAction {
              withdrawAmountUsd
              withdrawAmount
              timestamp
              repaid
              repaidUsd
              liquidationPrice
              isLiquidated
              id
              hash
              collateralShare
              collateralPriceUsd
              borrowPart
              blockNumber
            }
          }
        }
      }`;

  const { data } = await axios.post(url, { query });

  return data;
};
