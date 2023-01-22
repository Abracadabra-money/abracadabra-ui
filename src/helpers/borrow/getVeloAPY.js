import { ethers } from "ethers";
import axios from "axios";

import SolidlyGaugeVolatileLPStrategy from "@/utils/abi/SolidlyGaugeVolatileLPStrategy";

const getVeloManagementFee = async (pool, signer) => {
  try {
    const strategyAddress = await pool.masterContractInstance.strategy(
      pool.collateralToken.address
    );

    const strategy = new ethers.Contract(
      strategyAddress,
      JSON.stringify(SolidlyGaugeVolatileLPStrategy),
      signer
    );

    return await strategy.feePercent();
  } catch (error) {
    console.log("getVeloManadgmentFee error:", error);
  }
};

const getVeloApy = async (pool, signer) => {
  try {
    const response = await axios.get(
      "https://api.velodrome.finance/api/v1/pairs"
    );

    const opusdcPair = response.data.data.find(
      (pair) => pair.symbol === "vAMM-OP/USDC"
    );

    console.log("opusdcPair", opusdcPair);

    const APYVault = opusdcPair.apr;

    console.log("APYVault", APYVault);

    const strategyAddress = await pool.masterContractInstance.strategy(
      pool.collateralToken.address
    );

    const strategyData = await pool.masterContractInstance.strategyData(
      strategyAddress
    );

    const targetPercentage = strategyData.targetPercentage / 100;

    console.log("strategyAddress", strategyAddress);
    console.log("strategyData", strategyData);

    const stratPercentage = (await getVeloManagementFee(pool, signer)) / 100;

    const managementFee =
      (await pool.collateralToken.contract.feePercent()) / 100;

    console.log("stratPercentage", stratPercentage);
    console.log("managementFee", managementFee);

    const farmingPercentage = 1 - targetPercentage;

    const apy = APYVault * farmingPercentage * (1 - managementFee);

    return apy;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export { getVeloApy, getVeloManagementFee };
