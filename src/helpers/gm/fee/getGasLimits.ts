import { Contract, BigNumber, type providers } from "ethers";
import { MulticallWrapper } from "ethers-multicall-provider";
import DataStoreAbi from "@/utils/abi/gm/DataStoreAbi";
import { DATA_STORE } from "@/constants/gm";
import type { GasLimits } from "../types";

import {
  ESTIMATED_GAS_FEE_BASE_AMOUNT,
  ESTIMATED_GAS_FEE_MULTIPLIER_FACTOR,
  depositGasLimitKey,
  singleSwapGasLimitKey,
  withdrawalGasLimitKey,
} from "./dataStore";

export const getGasLimits = async (provider: providers.BaseProvider): Promise<GasLimits> => {
  const multicallProvider = MulticallWrapper.wrap(provider);

  const dataStoreContract = new Contract(
    DATA_STORE,
    DataStoreAbi,
    multicallProvider
  );

  const [
    depositSingleToken,
    withdrawalMultiToken,
    singleSwap,
    estimatedFeeBaseGasLimit,
    estimatedFeeMultiplierFactor,
  ] = await Promise.all([
    dataStoreContract.getUint(depositGasLimitKey(true)),
    dataStoreContract.getUint(withdrawalGasLimitKey()),
    dataStoreContract.getUint(singleSwapGasLimitKey()),
    dataStoreContract.getUint(ESTIMATED_GAS_FEE_BASE_AMOUNT),
    dataStoreContract.getUint(ESTIMATED_GAS_FEE_MULTIPLIER_FACTOR),
  ]);

  return {
    depositSingleToken: BigNumber.from(depositSingleToken),
    withdrawalMultiToken: BigNumber.from(withdrawalMultiToken),
    singleSwap: BigNumber.from(singleSwap),
    estimatedFeeBaseGasLimit: BigNumber.from(estimatedFeeBaseGasLimit),
    estimatedFeeMultiplierFactor: BigNumber.from(estimatedFeeMultiplierFactor),
  };
};
