import { MulticallWrapper } from "ethers-multicall-provider";
import {  Contract, type providers } from "ethers";
import { DATA_STORE } from "@/constants/gm";
import DataStoreAbi from "@/utils/abi/gm/DataStoreAbi";
import type { Address } from "viem";
import type { DataStoreInfo, MarketInfo } from "./types";

import {
  poolAmountKey,
  swapFeeFactorKey,
  poolAmountAdjustmentKey,
  swapImpactFactorKey,
  swapImpactExponentFactorKey,
  swapImpactPoolAmountKey,
  openInterestInTokensKey,
  openInterestKey,
  reserveFactorKey,
  maxPoolAmountForDepositKey,
  maxPoolAmountKey
} from "./fee/dataStore";

export const getDataStoreInfo = async (
  market: Address,
  marketInfo: MarketInfo,
  provider: providers.BaseProvider
): Promise<DataStoreInfo> => {
  const multicallProvider = MulticallWrapper.wrap(provider);

  const dataStoreContract = new Contract(
    DATA_STORE,
    DataStoreAbi,
    multicallProvider
  );

  const [
    swapFeeFactorForNegativeImpact,
    swapFeeFactorForPositiveImpact,
    longPoolAmount,
    shortPoolAmount,
    longPoolAmountAdjustment,
    shortPoolAmountAdjustment,
    swapImpactFactorPositive,
    swapImpactFactorNegative,
    swapImpactExponentFactor,
    swapImpactPoolAmountLong,
    swapImpactPoolAmountShort,
    longInterestInTokensUsingLongToken,
    longInterestInTokensUsingShortToken,
    shortInterestUsingLongToken,
    shortInterestUsingShortToken,
    reserveFactorLong,
    reserveFactorShort,
    maxLongPoolAmountForDeposit,
    maxShortPoolAmountForDeposit,
    maxLongPoolAmount,
    maxShortPoolAmount
  ] = await Promise.all([
    dataStoreContract.getUint(swapFeeFactorKey(market, false)),
    dataStoreContract.getUint(swapFeeFactorKey(market, true)),
    dataStoreContract.getUint(poolAmountKey(market, marketInfo.longToken)),
    dataStoreContract.getUint(poolAmountKey(market, marketInfo.shortToken)),
    dataStoreContract.getUint(
      poolAmountAdjustmentKey(market, marketInfo.longToken)
    ),
    dataStoreContract.getUint(
      poolAmountAdjustmentKey(market, marketInfo.shortToken)
    ),
    dataStoreContract.getUint(swapImpactFactorKey(market, true)),
    dataStoreContract.getUint(swapImpactFactorKey(market, false)),
    dataStoreContract.getUint(swapImpactExponentFactorKey(market)),
    dataStoreContract.getUint(
      swapImpactPoolAmountKey(market, marketInfo.longToken)
    ),
    dataStoreContract.getUint(
      swapImpactPoolAmountKey(market, marketInfo.shortToken)
    ),
    dataStoreContract.getUint(
      openInterestInTokensKey(market, marketInfo.longToken, true)
    ),
    dataStoreContract.getUint(
      openInterestInTokensKey(market, marketInfo.shortToken, true)
    ),
    dataStoreContract.getUint(
      openInterestKey(market, marketInfo.longToken, false)
    ),
    dataStoreContract.getUint(
      openInterestKey(market, marketInfo.shortToken, false)
    ),
    dataStoreContract.getUint(reserveFactorKey(market, true)),
    dataStoreContract.getUint(reserveFactorKey(market, true)),
    dataStoreContract.getUint(maxPoolAmountForDepositKey(market, marketInfo.longToken)),
    dataStoreContract.getUint(maxPoolAmountForDepositKey(market, marketInfo.shortToken)),
    
    dataStoreContract.getUint(maxPoolAmountKey(market, marketInfo.longToken)),
    dataStoreContract.getUint(maxPoolAmountKey(market, marketInfo.shortToken)),
  ]);

  return {
    swapFeeFactorForNegativeImpact,
    swapFeeFactorForPositiveImpact,
    longPoolAmount,
    shortPoolAmount,
    longPoolAmountAdjustment,
    shortPoolAmountAdjustment,
    swapImpactFactorPositive,
    swapImpactFactorNegative,
    swapImpactExponentFactor,
    swapImpactPoolAmountLong,
    swapImpactPoolAmountShort,
    longInterestInTokensUsingLongToken,
    longInterestInTokensUsingShortToken,
    shortInterestUsingLongToken,
    shortInterestUsingShortToken,
    reserveFactorLong,
    reserveFactorShort,
    maxLongPoolAmountForDeposit,
    maxShortPoolAmountForDeposit,
    maxLongPoolAmount,
    maxShortPoolAmount
  };
};
