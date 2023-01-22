import { ethers } from "ethers";
import axios from "axios";

import SolidlyGaugeVolatileLPStrategy from "@/utils/abi/SolidlyGaugeVolatileLPStrategy";

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

    console.log("strategyAddress", strategyAddress);

    const strategy = new ethers.Contract(
      strategyAddress,
      JSON.stringify(SolidlyGaugeVolatileLPStrategy),
      signer
    );

    const stratPercentage = (await strategy.feePercent()) / 10;

    const managementFee =
      (await pool.collateralToken.contract.feePercent()) / 10;

    console.log("stratPercentage", stratPercentage);
    console.log("managementFee", managementFee);

    const apy = (APYVault * stratPercentage) * (1 - managementFee);

    console.log("apy", apy);

    return apy;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export { getVeloApy };
