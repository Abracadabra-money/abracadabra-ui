import { utils, BigNumber } from "ethers";
import type { UserPositions, UserTotalAssets } from "@/helpers/cauldron/types";

export const getUsersTotalAssets = (
  positions: UserPositions[]
): UserTotalAssets => {
  const COLLATERAL_PRECISION = 2;
  //TODO: after alternative data removal rewrite calculation
  const collateralDeposited = positions.reduce((accumulator, position) => {
    const collateralValue = BigNumber.from(
      position.collateralInfo.userCollateralShare
    )
      .mul(Math.pow(10, COLLATERAL_PRECISION))
      .div(BigNumber.from(position.oracleRate));
    return accumulator.add(collateralValue);
  }, BigNumber.from(0));

  const mimBorrowed = positions.reduce((accumulator, position) => {
    return accumulator.add(
      BigNumber.from(position.borrowInfo.userBorrowAmount)
    );
  }, BigNumber.from(0));

  return {
    collateralDepositedInUsd: Number(
      utils.formatUnits(collateralDeposited, COLLATERAL_PRECISION)
    ),
    mimBorrowed: Number(utils.formatUnits(mimBorrowed)),
  };
};
