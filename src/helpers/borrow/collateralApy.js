import sushiData from "@sushiswap/sushi-data";
import store from "@/store";
import crvRewardPoolAbi from "@/utils/abi/crvRewardPoolAbi";
import tokenCVXAbi from "@/utils/abi/tokensAbi/CVX";
import axios from "axios";
import { ethers } from "ethers";
import { getTokenPriceByAddress } from "../priceHelper";
import { getStargateApy } from "@/helpers/borrow/stargateApyHelper";

// wMEMO pool APY
import timeStakingAbi from "@/utils/abi/timeStaking";
import memoTokenAbi from "@/utils/abi/tokensAbi/MEMO";

let crvTokenPrice = null;
let cvxTokenPrice = null;
const mainnetId = 1;

const getCurveDaoTokenPrice = async (
  chainId,
  address = "0xD533a949740bb3306d119CC777fa900bA034cd52"
) => {
  return await getTokenPriceByAddress(chainId, address);
};

const convexFinanceTokenPrice = async (
  chainId,
  address = "0x4e3FBD56CD56c3e72c1403e103b45Db9da5B9D2B"
) => {
  return await getTokenPriceByAddress(chainId, address);
};

const getMEMOApy = async (signer) => {
  try {
    const STAKING_ADDRESS = "0x4456B87Af11e87E329AB7d7C7A246ed1aC2168B9";
    const MEMO_ADDRESS = "0x136Acd46C134E8269052c62A67042D6bDeDde3C9";

    const stakingContract = new ethers.Contract(
      STAKING_ADDRESS,
      JSON.stringify(timeStakingAbi),
      signer
    );
    const memoContract = new ethers.Contract(
      MEMO_ADDRESS,
      JSON.stringify(memoTokenAbi),
      signer
    );

    const epoch = await stakingContract.epoch();
    const stakingReward = epoch.distribute;
    const circ = await memoContract.circulatingSupply();
    const stakingRebase = stakingReward / circ;
    const stakingAPY = Math.pow(1 + stakingRebase, 365 * 3) - 1;

    const result = stakingAPY * 100;

    return result;
  } catch (e) {
    console.log("getMEMOApy ERROR", e);
  }
};

const getTokenXSushiAPY = async () => {
  // thanks to sushi guys:)
  try {
    const results = await Promise.all([
      sushiData.bar.info(),
      sushiData.exchange.dayData(),
      sushiData.sushi.priceUSD(),
    ]);
    const apr =
      (((results[1][1].volumeUSD * 0.05) / results[0].totalSupply) * 365) /
      (results[0].ratio * results[2]);

    return apr;
  } catch (e) {
    console.log("getTokenXSushiAPY err", e);
    return null;
  }
};

const fetchOHMApy = async () => {
  try {
    const response = await axios({
      url: "https://api.thegraph.com/subgraphs/name/drondin/olympus-graph",
      method: "post",
      headers: { "Content-Type": "application/json" },
      data: JSON.stringify({
        query: `
            query {
              _meta {
                block {
                  number
                }
              }
              protocolMetrics(first: 1, orderBy: timestamp, orderDirection: desc) {
                currentAPY
              }
            }
          `,
      }),
    });

    if (response.data?.data?.protocolMetrics?.[0].currentAPY) {
      return +response.data?.data?.protocolMetrics?.[0].currentAPY;
    }

    return false;
  } catch (e) {
    console.log("fetchOHMApy error:", e);

    return false;
  }
};

const getCrvPoolApy = async (tokenRate, signer, chainId) => {
  try {
    const crvRewardPoolContract = new ethers.Contract(
      "0x689440f2Ff927E1f24c72F1087E1FAF471eCe1c8",
      JSON.stringify(crvRewardPoolAbi),
      signer
    );

    const rewardRate = await crvRewardPoolContract.rewardRate({
      gasLimit: 300000,
    });

    const totalSupply = await crvRewardPoolContract.totalSupply({
      gasLimit: 300000,
    });

    const tokenIn1000Usd = 1000 * tokenRate;

    const secondsPerYear = 31536000;

    const crvReward =
      (+rewardRate / +totalSupply) * tokenIn1000Usd * secondsPerYear;

    const cvxReward = await convertCrvToCvx(crvReward, signer);

    const parsedCvxReward = ethers.utils.formatEther(cvxReward);

    let crvPrice = crvTokenPrice;
    let cvxPrice = cvxTokenPrice;

    if (!crvTokenPrice) {
      crvTokenPrice = await getCurveDaoTokenPrice(chainId);
    }

    if (!cvxTokenPrice) {
      cvxTokenPrice = await convexFinanceTokenPrice(chainId);
    }

    crvPrice = crvTokenPrice;
    cvxPrice = cvxTokenPrice;

    const apy = (+crvReward * crvPrice + parsedCvxReward * cvxPrice) / 10;

    return +apy;
  } catch (e) {
    console.log("getCrvToCvx err", e);
  }
};

const convertCrvToCvx = async (amount, signer) => {
  try {
    let _amount = ethers.utils.parseUnits(parseFloat(amount).toFixed(18), 18);

    const cvxTokenContract = new ethers.Contract(
      "0x4e3fbd56cd56c3e72c1403e103b45db9da5b9d2b",
      JSON.stringify(tokenCVXAbi),
      signer
    );

    const supply = await cvxTokenContract.totalSupply({
      gasLimit: 300000,
    });
    const reductionPerCliff = await cvxTokenContract.reductionPerCliff({
      gasLimit: 300000,
    });
    const totalCliffs = await cvxTokenContract.totalCliffs({
      gasLimit: 300000,
    });
    const maxSupply = await cvxTokenContract.maxSupply({
      gasLimit: 300000,
    });

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

const getCryptoPoolApy = async (tokenRate, signer, chainId) => {
  try {
    const crvRewardPoolContract = new ethers.Contract(
      "0x9d5c5e364d81dab193b72db9e9be9d8ee669b652",
      JSON.stringify(crvRewardPoolAbi),
      signer
    );

    const rewardRate = await crvRewardPoolContract.rewardRate({
      gasLimit: 300000,
    });

    const totalSupply = await crvRewardPoolContract.totalSupply({
      gasLimit: 300000,
    });

    const tokenIn1000Usd = 1000 * tokenRate;

    const secondsPerYear = 31536000;

    const crvReward =
      (+rewardRate / +totalSupply) * tokenIn1000Usd * secondsPerYear;

    const cvxReward = await convertCrvToCvx(crvReward, signer);

    const parsedCvxReward = ethers.utils.formatEther(cvxReward);

    let crvPrice = crvTokenPrice;
    let cvxPrice = cvxTokenPrice;

    if (!crvTokenPrice) {
      crvTokenPrice = await getCurveDaoTokenPrice(chainId);
    }

    if (!cvxTokenPrice) {
      cvxTokenPrice = await convexFinanceTokenPrice(chainId);
    }

    crvPrice = crvTokenPrice;
    cvxPrice = cvxTokenPrice;

    const apy = (+crvReward * crvPrice + parsedCvxReward * cvxPrice) / 10;

    return +apy;
  } catch (e) {
    console.log("getCrvToCvx err", e);
  }
};

export const getTokensVaults = async () => {
  return await store.dispatch("fetchTokenVaults");
};

export const getXBOOApy = async () => {
  try {
    const response = await axios.get("https://api.spookyswap.finance/api/xboo");
    return response.data;
  } catch (e) {
    console.log("getXBOOApy err: ", e);
    return null;
  }
};

const getJLPApr = async (joeInfo, tokenPrice, tokenInstance, signer) => {
  const masterJoeContract = new ethers.Contract(
    joeInfo.address,
    JSON.stringify(joeInfo.abi),
    signer
  );

  let poolInfo;

  try {
    poolInfo = await masterJoeContract.poolInfo(joeInfo.pid, {
      gasLimit: 600000,
    });
  } catch (e) {
    console.log("pool infi err:", e);
  }

  let stakingTokenTotalAmount;

  try {
    stakingTokenTotalAmount = await tokenInstance.balanceOf(joeInfo.address, {
      gasLimit: 600000,
    });
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

export const fetchTokenApy = async (pool) => {
  let chainId = store.getters.getChainId;
  let signer = store.getters.getSigner;
  ("");

  console.log("fetchTokenApy chainId", chainId);
  console.log("fetchTokenApy signer", signer);

  if (pool.id === 5 && chainId === 250) {
    return await getXBOOApy();
  }

  if (pool.joeInfo) {
    const jlpPrice = 1 / pool.borrowToken.exchangeRate;
    return await getJLPApr(
      pool.joeInfo,
      jlpPrice,
      pool.collateralToken.contract,
      signer
    );
  }

  if (pool.id === 10 && chainId === mainnetId) {
    return await fetchOHMApy();
  }

  if (
    (pool.id === 15 || pool.id === 24 || pool.id === 25) &&
    chainId === mainnetId
  ) {
    return await getCrvPoolApy(pool.borrowToken.exchangeRate, signer, chainId);
  }

  if (pool.id === 16 && chainId === mainnetId) {
    return await getCryptoPoolApy(
      pool.borrowToken.exchangeRate,
      signer,
      chainId
    );
  }

  if ((pool.id === 19 || pool.id === 26) && chainId === mainnetId) {
    return 0;
  }

  if ((pool.id === 31 || pool.id === 32) && chainId === mainnetId) {
    return await getStargateApy(pool.collateralToken.contract.address, signer);
  }

  if ((pool.id === 2 || pool.id === 5) && chainId === 43114) {
    return await getMEMOApy(signer);
  }

  if ((pool.id === 5 || pool.id === 8) && chainId === mainnetId) {
    return await getTokenXSushiAPY();
  } else {
    if (store.getters.getTokensVaults.length === 0) {
      const tokensVaults = await getTokensVaults();
      store.commit("setTokensVaults", tokensVaults);
    }

    const tokenItem = store.getters.getTokensVaults.find(
      (item) => item.address === pool.collateralToken.address
    );

    if (!tokenItem) return null;

    return tokenItem.apy.net_apy * 100;
  }
};
