import { Contract, BigNumber } from "ethers";

import DataStoreAbi from "@/utils/abi/gm/DataStoreAbi";
import { DATA_STORE } from "@/constants/gm";

import {
  ESTIMATED_GAS_FEE_BASE_AMOUNT,
  ESTIMATED_GAS_FEE_MULTIPLIER_FACTOR,
  depositGasLimitKey,
  singleSwapGasLimitKey,
  withdrawalGasLimitKey,
} from "./dataStore";

export const getGasLimits = async (provider) => {
  const dataStoreContract = new Contract(DATA_STORE, DataStoreAbi, provider);

  const depositSingleToken = await dataStoreContract.getUint(
    depositGasLimitKey(true)
  );
  const withdrawalMultiToken = await dataStoreContract.getUint(
    withdrawalGasLimitKey()
  );
  const singleSwap = await dataStoreContract.getUint(singleSwapGasLimitKey());
  const estimatedFeeBaseGasLimit = await dataStoreContract.getUint(
    ESTIMATED_GAS_FEE_BASE_AMOUNT
  );
  const estimatedFeeMultiplierFactor = await dataStoreContract.getUint(
    ESTIMATED_GAS_FEE_MULTIPLIER_FACTOR
  );

  return {
    depositSingleToken: BigNumber.from(depositSingleToken),
    withdrawalMultiToken: BigNumber.from(withdrawalMultiToken),
    singleSwap: BigNumber.from(singleSwap),
    estimatedFeeBaseGasLimit: BigNumber.from(estimatedFeeBaseGasLimit),
    estimatedFeeMultiplierFactor: BigNumber.from(estimatedFeeMultiplierFactor),
  };
};
