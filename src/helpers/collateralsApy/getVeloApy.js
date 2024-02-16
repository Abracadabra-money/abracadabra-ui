import { ethers } from "ethers";
import axios from "axios";

import SolidlyGaugeVolatileLPStrategy from "@/abis/SolidlyGaugeVolatileLPStrategy";

const getVeloManagementFee = async (pool, provider) => {
  try {
    const strategyAddress = await pool.contracts.bentoBox.strategy(
      pool.config.collateralInfo.address
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

    //todo const strategyData = await pool.masterContractInstance.strategyData(
    const strategyData = await pool.contracts.bentoBox.strategyData(
      pool.config.collateralInfo.address
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
