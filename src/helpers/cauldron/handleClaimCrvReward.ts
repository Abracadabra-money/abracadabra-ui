import type { Contract } from "ethers";

export const handleClaimCrvReward = async (
  contract: Contract,
  account: String
) => {
  try {
    const estimateGas = await contract.estimateGas.getReward(account);

    const gasLimit = 1000 + +estimateGas.toString();

    await contract.getReward(account, { gasLimit });
  } catch (error) {
    console.log("Handle Claim Crv Reward Error:", error);
  }
};
