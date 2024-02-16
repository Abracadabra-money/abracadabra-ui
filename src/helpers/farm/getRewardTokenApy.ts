import { Contract, utils } from "ethers";
import store from "@/store";

export const getRewardTokenApy = async (
  contractAddress: string,
  contractABI: any,
  rewardTokenAddress: string
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

export const calculateAPR = async (
  contractAddress: string,
  contractABI: any,
  stakingTokenPrice: any,
  rewardTokensInfo: any,
  publicClient: any
): Promise<any> => {
  try {
    const totalSupply = await publicClient.readContract({
      address: contractAddress,
      abi: contractABI,
      functionName: "totalSupply",
      args: [],
    });

    const totalStakedInUSD =
      Number(utils.formatUnits(totalSupply, 18)) * stakingTokenPrice;

    let totalAnnualRewardsInUSD = 0;
    const tokensApr = [];

    for (const tokenInfo of rewardTokensInfo) {
      const rewardData = await publicClient.readContract({
        address: contractAddress,
        abi: contractABI,
        functionName: "rewardData",
        args: [tokenInfo.address],
      });
      const rewardTokenPrice = tokenInfo.price;

      const annualReward =
        //@ts-ignore
        utils.formatUnits(rewardData.rewardRate, 18) *
        (365 * 24 * 60 * 60) *
        // rewardData.rewardsDuration *
        rewardTokenPrice;

      const tokenApr = (annualReward / totalStakedInUSD) * 100;

      tokensApr.push({
        address: tokenInfo.address,
        apr: tokenApr,
      });

      totalAnnualRewardsInUSD += annualReward;
    }

    const totalApr = (totalAnnualRewardsInUSD / totalStakedInUSD) * 100;

    return { totalApr, tokensApr };
  } catch (error) {
    console.error("Error calculating APR:", error);
    return 0;
  }
};
