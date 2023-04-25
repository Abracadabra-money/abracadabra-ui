import type { BigNumber, Contract } from "ethers";

export type UserColalteralInfo = {
  userCollateralShare: BigNumber;
  userCollateralAmount: BigNumber;
};

export const getUserCollateralInfo = async (
  user: string,
  bentoBox: Contract,
  cauldron: Contract,
  collateral: string
): Promise<UserColalteralInfo> => {
  const userCollateralShare: BigNumber = await cauldron.userCollateralShare(
    user
  );

  const userCollateralAmount: BigNumber = await bentoBox.toAmount(
    collateral,
    userCollateralShare,
    false
  );

  return {
    userCollateralShare,
    userCollateralAmount,
  };
};