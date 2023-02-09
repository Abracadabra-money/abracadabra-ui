import { ethers } from "ethers";
import apeCoinStakingAbi from "@/helpers/collateralsApy/getApeApy/apeCoinStakingAbi.js";

const apeCoinStakingAddress = "0x5954aB967Bc958940b7EB73ee84797Dc8a2AFbb9";

const getApeApy = async (provider) => {
  const apeCoinStakingContract = await new ethers.Contract(
    apeCoinStakingAddress,
    JSON.stringify(apeCoinStakingAbi),
    provider
  );

  const poolsUI = await apeCoinStakingContract.getPoolsUI();

  const rewardPerHour = +ethers.utils.formatUnits(
    poolsUI[0].currentTimeRange.rewardsPerHour
  );

  const rewardPerDay = rewardPerHour * 24;

  const stakedAmount = +ethers.utils.formatUnits(poolsUI[0].stakedAmount);

  return (rewardPerDay / stakedAmount) * 365 * 100;
};

export { getApeApy };
