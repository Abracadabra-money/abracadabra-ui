import { utils } from "ethers";

export const getMaxWithdrawableAmount = async (
  config,
  cauldron,
  bentoBoxAddress
) => {
  let maxWithdrawableAmount = -1;

  // check if we can do this dynamically
  if (config.cauldronSettings.hasWithdrawableLimit) {
    const collateralBalance = await cauldron.balanceOf(bentoBoxAddress);

    maxWithdrawableAmount = utils.formatUnits(
      collateralBalance,
      config.token.decimals
    );
  }

  return maxWithdrawableAmount;
};
