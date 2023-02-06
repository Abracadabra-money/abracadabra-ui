import { ethers } from "ethers";
import axios from "axios";

const getJlpApy = async (pool, signer) => {

    const joeInfo = pool.joeInfo;
    const tokenPrice = 1 / pool.borrowToken.exchangeRate;
    const tokenInstance = pool.collateralToken.contract;

  const masterJoeContract = new ethers.Contract(
    joeInfo.address,
    JSON.stringify(joeInfo.abi),
    signer
  );

  let poolInfo;

  try {
    poolInfo = await masterJoeContract.poolInfo(joeInfo.pid);
  } catch (e) {
    console.log("pool infi err:", e);
  }

  let stakingTokenTotalAmount;

  try {
    stakingTokenTotalAmount = await tokenInstance.balanceOf(joeInfo.address);
  } catch (e) {
    console.log("pool infi err:", e);
  }

  const joeYield = await getJlpYield(
    masterJoeContract,
    1000 / tokenPrice,
    stakingTokenTotalAmount,
    poolInfo.allocPoint,
    poolInfo.accJoePerShare
  );

  let joeTokenPrice;
  try {
    const joeTokenResp = await axios.get(
      "https://min-api.cryptocompare.com/data/price?fsym=JOE&tsyms=USD"
    );

    joeTokenPrice = joeTokenResp.data["USD"];
  } catch (e) {
    return null;
  }

  const usdInDay = parseFloat(joeYield) * parseFloat(joeTokenPrice);

  const rewardPercent = (usdInDay / 1000) * 100;

  const yearRewardPercent = rewardPercent * 365;

  return yearRewardPercent * 0.85 * 0.9;
};

const getJlpYield = async (
  contractInstance,
  amount,
  stakingTokenTotalAmount,
  allocPoint,
  accIcePerShare
) => {
  try {
    const divide =
      +ethers.utils.formatEther(stakingTokenTotalAmount.toString()) + +amount;

    const multiplier = 86400;

    const icePerSecondResp = await contractInstance.joePerSec();
    const icePerSecond = +icePerSecondResp;

    const totalAllocPointResp = await contractInstance.totalAllocPoint();
    const totalAllocPoint = +totalAllocPointResp;

    const devPercent = await contractInstance.devPercent();
    const investorPercent = await contractInstance.investorPercent();
    const treasuryPercent = await contractInstance.treasuryPercent();

    const lpPercent =
      1000 - (+devPercent + +investorPercent + +treasuryPercent);

    const joeReward =
      (+multiplier * +icePerSecond * +allocPoint) / +totalAllocPoint;

    let accJoePerShare =
      +accIcePerShare +
      (((+joeReward * Math.pow(10, 12)) / +divide) * +lpPercent) / 1000;

    const rewardDebt = (+amount * +accIcePerShare) / Math.pow(10, 12);

    const pending =
      (+amount * +accJoePerShare) / Math.pow(10, 12) - +rewardDebt;
    return pending / Math.pow(10, 18);
  } catch (error) {
    console.log("getYield", error);
    return 0;
  }
};


export { getJlpApy }
