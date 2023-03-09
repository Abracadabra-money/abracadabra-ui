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

export const getBestExchangeRate = async ({oracleRate, cauldronRate}) => {
  try {
    let exchangeRate;
    let updatePrice = false;

    if (oracleRate.gt(cauldronRate) && !cauldronRate.eq(0)) {
      exchangeRate = cauldronRate;
      updatePrice = true;
    } else if (cauldronRate.eq(0)) {
      exchangeRate = oracleRate;
      updatePrice = true;
    } else {
      exchangeRate = oracleRate;
    }

    return { exchangeRate, updatePrice };
  } catch (error) {
    console.log("getBestExchangeRate error:", error);
  }
};
