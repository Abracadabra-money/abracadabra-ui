import { ethers } from "ethers";
import axios from "axios";

import SolidlyGaugeVolatileLPStrategy from "@/utils/abi/SolidlyGaugeVolatileLPStrategy";

const getVeloManagementFee = async (pool, provider) => {
  try {
    const strategyAddress = await pool.masterContractInstance.strategy(
      pool.collateralToken.address
    );

    const strategy = new ethers.Contract(
      strategyAddress,
      JSON.stringify(SolidlyGaugeVolatileLPStrategy),
      provider
    );

    return await strategy.feePercent();
  } catch (error) {
    console.log("getVeloManadgmentFee error:", error);
  }
};

const getVeloApy = async (pool, provider) => {
  try {
    const response = await axios.get(
      "https://api.velodrome.finance/api/v1/pairs"
    );

    const opusdcPair = response.data.data.find(
      (pair) => pair.symbol === "vAMM-OP/USDC"
    );

    const APYVault = opusdcPair.apr;

    const strategyData = await pool.masterContractInstance.strategyData(
      pool.collateralToken.address
    );

    const targetPercentage = strategyData.targetPercentage / 100;

    const stratPercentage = (await getVeloManagementFee(pool, provider)) / 100;

    const apy = APYVault * targetPercentage * (1 - stratPercentage);

    return apy;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export { getVeloApy, getVeloManagementFee };
