// import { ethers } from "ethers";
// import apeCoinStakingAbi from "@/helpers/collateralsApy/getApeApy/apeCoinStakingAbi.js";

// const apeCoinStakingAddress = "0x5954aB967Bc958940b7EB73ee84797Dc8a2AFbb9";
import axios from "axios";

// const getApeApy = async (provider) => {
const getApeApy = async () => {
  // const apeCoinStakingContract = await new ethers.Contract(
  //   apeCoinStakingAddress,
  //   JSON.stringify(apeCoinStakingAbi),
  //   provider
  // );

  // const poolsUI = await apeCoinStakingContract.getPoolsUI();

  // const rewardPerHour = +ethers.utils.formatUnits(
  //   poolsUI[0].currentTimeRange.rewardsPerHour
  // );

  // const rewardPerDay = rewardPerHour * 24;

  // const stakedAmount = +ethers.utils.formatUnits(poolsUI[0].stakedAmount);

  // return (rewardPerDay / stakedAmount) * 365 * 100;
  const response = await axios.get(
    "https://analytics.abracadabra.money/api/mape"
  );

  return response.data[0].apy.toFixed(2);
};

export { getApeApy };
