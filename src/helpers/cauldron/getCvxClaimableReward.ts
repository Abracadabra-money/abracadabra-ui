import type { BigNumberish, Contract } from "ethers";
import { utils } from "ethers";

export const getCvxClaimableReward = async (
  contract: Contract,
  account: String,
  decimals: BigNumberish
): Promise<number | null> => {
  if (!contract.cvx_claimable_reward) return null;

  try {
    const reward = await contract.cvx_claimable_reward(account);
    return +utils.formatUnits(reward, decimals);
  } catch (error) {
    console.log("Get Cvx Claimable Reward Error:", error);
    return null;
  }
};
