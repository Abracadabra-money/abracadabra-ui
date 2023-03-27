import { utils } from "ethers";

export const getCvxClaimableReward = async (collateral, user) => {
  try {
    const reward = await collateral.cvx_claimable_reward(user);
    return utils.formatUnits(reward);
  } catch (error) {
    console.log("getCvxClaimableReward error: ", error);
  }
};