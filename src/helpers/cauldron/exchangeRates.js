import { Contract } from "ethers";
import oracleAbi from "@/utils/abi/oracle";

export const getCauldronOracleRates = async (cauldron, provider) => {
  try {
    const oracle = await cauldron.oracle();
    const oracleData = await cauldron.oracleData();

    const oracleContract = new Contract(oracle, oracleAbi, provider);

    const oracleRate = await oracleContract.peekSpot(oracleData);
    const cauldronRate = await cauldron.exchangeRate();

    return {
      oracleRate,
      cauldronRate,
    };
  } catch (error) {
    console.log("getCauldronOracleRates error:", error);
  }
};

export const getIsUpdateRate = async ({oracleRate, cauldronRate}) => {
  try {
    let updateRate = false;

    if (oracleRate.gt(cauldronRate) && !cauldronRate.eq(0)) {
      updateRate = true;
    } else if (cauldronRate.eq(0)) {
      updateRate = true;
    }

    return updateRate;
  } catch (error) {
    console.log("getIsUpdateRate error:", error);
  }
};
