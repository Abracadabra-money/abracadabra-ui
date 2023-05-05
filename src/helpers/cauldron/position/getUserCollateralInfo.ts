import type { BigNumber, Contract } from "ethers";

export type UserCollateralInfo = {
  userCollateralShare: BigNumber;
  userCollateralAmount: BigNumber;
};

export const getUserCollateralInfo = async (
  user: string,
  bentoBox: Contract,
  cauldron: Contract,
  collateral: string
): Promise<UserCollateralInfo> => {
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