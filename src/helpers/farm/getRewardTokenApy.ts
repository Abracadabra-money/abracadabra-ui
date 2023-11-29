import { Contract, utils } from "ethers";
import store from "@/store";

export const getRewardTokenApy = async (
  contractAddress: string,
  contractABI: any,
  rewardTokenAddress: string,
): Promise<number> => {
  const provider = store.getters.getProvider;

  const contract = new Contract(contractAddress, contractABI, provider);

  try {
    const rewardData = await contract.rewardData(rewardTokenAddress);
    const totalSupply = await contract.totalSupply();

    if (totalSupply.isZero() || rewardData.rewardRate.isZero()) {
      return 0;
    }

    const totalAnnualReward = rewardData.rewardRate
      .mul(365 * 24 * 60 * 60)
      .div(rewardData.rewardsDuration);

    // Assuming the value of reward tokens and staked tokens are 1:1 for simplicity
    // In practice, you should adjust this based on their actual market values
    const apy = totalAnnualReward
      .mul(utils.parseUnits("1", 18))
      .div(totalSupply)
      .mul(100);

    return Number(utils.formatUnits(apy, 18));
  } catch (error) {
    console.error("Error calculating APY:", error);
    throw error;
  }
};
