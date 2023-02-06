import { ethers } from "ethers";
import { getTokenPriceByAddress } from "../priceHelper";
import crvRewardPoolAbi from "@/utils/abi/crvRewardPoolAbi";
import tokenCVXAbi from "@/utils/abi/tokensAbi/CVX";

let crvTokenPrice = null;
let cvxTokenPrice = null;

const getCrvApy = async (pool, baseRewardPool, provider) => {
  try {
    const tokenRate = pool.borrowToken.exchangeRate;

    const crvRewardPoolContract = new ethers.Contract(
        baseRewardPool,
      JSON.stringify(crvRewardPoolAbi),
      provider
    );

    const rewardRate = await crvRewardPoolContract.rewardRate();

    const totalSupply = await crvRewardPoolContract.totalSupply();

    const tokenIn1000Usd = 1000 * tokenRate;

    const secondsPerYear = 31536000;

    const crvReward =
      (+rewardRate / +totalSupply) * tokenIn1000Usd * secondsPerYear;

    const cvxReward = await convertCrvToCvx(crvReward, provider);

    const parsedCvxReward = ethers.utils.formatEther(cvxReward);

    let crvPrice = crvTokenPrice;
    let cvxPrice = cvxTokenPrice;

    if (!crvTokenPrice) {
      crvTokenPrice = await getCurveDaoTokenPrice();
    }

    if (!cvxTokenPrice) {
      cvxTokenPrice = await convexFinanceTokenPrice();
    }

    crvPrice = crvTokenPrice;
    cvxPrice = cvxTokenPrice;

    const apy = (+crvReward * crvPrice + parsedCvxReward * cvxPrice) / 10;

    return +apy;
  } catch (e) {
    console.log("getCrvToCvx err", e);
  }
};

const getCurveDaoTokenPrice = async (
  address = "0xD533a949740bb3306d119CC777fa900bA034cd52"
) => {
  return await getTokenPriceByAddress(1, address);
};

const convexFinanceTokenPrice = async (
  address = "0x4e3FBD56CD56c3e72c1403e103b45Db9da5B9D2B"
) => {
  return await getTokenPriceByAddress(1, address);
};

const convertCrvToCvx = async (amount, provider) => {
  try {
    let _amount = ethers.utils.parseUnits(parseFloat(amount).toFixed(18), 18);

    const cvxTokenContract = new ethers.Contract(
      "0x4e3fbd56cd56c3e72c1403e103b45db9da5b9d2b",
      JSON.stringify(tokenCVXAbi),
      provider
    );

    const supply = await cvxTokenContract.totalSupply();
    const reductionPerCliff = await cvxTokenContract.reductionPerCliff();
    const totalCliffs = await cvxTokenContract.totalCliffs();
    const maxSupply = await cvxTokenContract.maxSupply();

    const cliff = supply.div(reductionPerCliff);
    //mint if below total cliffs
    if (cliff.lt(totalCliffs)) {
      //for reduction% take inverse of current cliff
      const reduction = totalCliffs.sub(cliff);
      //reduce
      _amount = _amount.mul(reduction).div(totalCliffs);
      //supply cap check
      const amtTillMax = maxSupply.sub(supply);
      if (_amount.gt(amtTillMax)) {
        _amount = amtTillMax;
      }
      //mint
      return _amount;
    }
    return 0;
  } catch (e) {
    console.log("ConvertCrvToCvx err:", e);
  }
};

export { getCrvApy }