import { utils, Contract } from "ethers";

export const getMaxWithdrawableAmount = async (
  decimals: number,
  collateral: Contract,
  bentoBoxAddress: string
): Promise<string> => {
  const collateralBalance = await collateral.balanceOf(bentoBoxAddress);

  const maxWithdrawableAmount = utils.formatUnits(
    collateralBalance,
    decimals
  );

  return maxWithdrawableAmount;
};
