import axios from "axios";
import { utils } from "ethers";
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
                decimals
              }
            }
            snapshots(orderBy: timestamp, orderDirection: asc) {
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

  const result = data.data.account.states.map(
    ({ borrowPart, collateralShare, cauldron, snapshots }: any) => {
      if (+borrowPart === 0 && +collateralShare === 0) return 0;

      const { decimals, lastPriceUsd } = cauldron.collateral;
      if (+borrowPart === 0) {
        const parseColateral = +utils.formatUnits(collateralShare, decimals);

        const firstPrice = parseColateral * +snapshots[0].collateralPriceUsd;

        const lastPrice = parseColateral * +lastPriceUsd;

        return { profit: lastPrice - firstPrice, cauldron: cauldron.id };
      }
    }
  );

  console.log(result);

  // const result = {
  //   withdrawAmountUsd: 0,
  //   withdrawAmount: ethers.utils.parseUnits("0", collateral.decimals),
  // };

  // console.log("result 111", result);

  // snapshots.forEach((element) => {
  //   result.withdrawAmountUsd =
  //     result.withdrawAmountUsd + +element.withdrawAmountUsd;

  //   // console.log(
  //   //   "result.withdrawAmount",
  //   //   ethers.utils.formatEther(result.withdrawAmount)
  //   // );
  //   // console.log(
  //   //   "element.withdrawAmount,",
  //   //   ethers.utils.formatEther(element.withdrawAmount)
  //   // );

  //   result.withdrawAmount = result.withdrawAmount
  //     .add(ethers.utils.parseUnits(element.withdrawAmount, collateral.decimals))
  //     .div(Math.pow(10, 18).toString());
  // });

  // // const test = ethers.utils
  // //   .parseEther("0")
  // //   .add(ethers.utils.parseUnits("4043554092343899278602", 18))
  // //   .div(Math.pow(10, 18).toString());

  // // console.log("result", collateral.decimals);
  // console.log("result", ethers.utils.formatEther(result.withdrawAmount));

  // const firstAction = snapshots[0];

  return data;
};
