import { BigNumber } from "ethers";

export const getMaxWithdrawAmount = async (cauldronInfo: any) => {
  const { hasWithdrawableLimit } = cauldronInfo.config.cauldronSettings;
  if (!hasWithdrawableLimit) return BigNumber.from("0");
  const { collateral, bentoBox } = cauldronInfo.contracts;
  return await collateral.balanceOf(bentoBox.address);
};
