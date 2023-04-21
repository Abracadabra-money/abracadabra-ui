import { Contract, providers, BigNumber } from "ethers";
import oracleAbi from "@/utils/abi/oracle";

type OracleRates = {
  oracleRate: BigNumber,
  cauldronRate: BigNumber
}

export const getCauldronOracleRates = async (cauldron: Contract, provider: providers.Provider): Promise<OracleRates> => {
  const oracle = await cauldron.oracle();
  const oracleData = await cauldron.oracleData();

  const oracleContract = new Contract(oracle, oracleAbi, provider);

  const oracleRate = await oracleContract.peekSpot(oracleData);
  const cauldronRate = await cauldron.exchangeRate();

  return {
    oracleRate,
    cauldronRate,
  };
};

export const getIsUpdateRate = ({oracleRate, cauldronRate}: OracleRates): boolean => {
  let updateRate = false;

  if (oracleRate.gt(cauldronRate) && !cauldronRate.eq(0)) {
    updateRate = true;
  } else if (cauldronRate.eq(0)) {
    updateRate = true;
  }

  return updateRate;
};
