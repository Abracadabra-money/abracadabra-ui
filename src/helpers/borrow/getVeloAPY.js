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


    const strategyData = await pool.masterContractInstance.strategyData(
      strategyAddress
    );

    const targetPercentage = strategyData.targetPercentage / 100;

    console.log("strategyAddress", strategyAddress);
    console.log("strategyData", strategyData);

    const strategy = new ethers.Contract(
      strategyAddress,
      JSON.stringify(SolidlyGaugeVolatileLPStrategy),
      signer
    );

    const stratPercentage = (await strategy.feePercent()) / 100;

    const managementFee =
      (await pool.collateralToken.contract.feePercent()) / 100;

    console.log("stratPercentage", stratPercentage);
    console.log("managementFee", managementFee);

    const farmingPercentage =  1 - targetPercentage;

    const apy = (APYVault * farmingPercentage) * (1 - managementFee);


    // const apyLp = 0.2; // idk yet how to get this one
    // const apyFarm = 0.25; // should get it from velodrome api ?
    // // from degenbox strategyData call with (0xA3372CD2178c52fdCB1f6e4c4E93014B4dB3B20d), currently 0% allocation as setStrategyTargetPercentage as not be called on degenBox yet
    // const strategyAllocation = 0.9;

    // let allocatedApyLp =  apyLp * (1 - strategyAllocation);
    // allocatedApyLp -= allocatedApyLp * managementFee;
    // let allocatedApyFarm = apyFarm * strategyAllocation;
    // allocatedApyFarm -= allocatedApyFarm * stratPercentage;

    // const secondaApy = allocatedApyLp + allocatedApyFarm;

    // console.log("secondaApy", secondaApy);

    return apy;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export { getVeloApy };
