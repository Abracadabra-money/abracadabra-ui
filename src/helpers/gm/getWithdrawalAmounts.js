import GMXReaderAbi from "@/utils/abi/gm/GMXReaderAbi";
import { Contract, BigNumber } from "ethers";

import DataStoreAbi from "@/utils/abi/gm/DataStoreAbi";
import ERC20 from "@/utils/zeroXSwap/abi/ERC20";

import { convertToUsd, convertToTokenAmount } from "./utils";
import { applyFactor } from "./fee/applyFactor";
import { expandDecimals } from "./fee/expandDecials";
import { poolAmountKey, swapFeeFactorKey } from "./fee/dataStore";
import { getMarkeTokemPrice } from "./getMarketPrice";
import { getContractMarketPrices } from "./getContractMarketPrices";
import { getMarketInfo } from "./getMarketInfo";
import { marketTokenAmountToUsd } from "./marketTokenAmountToUsd";
import { applySlippageToMinOut } from "./applySlippageToMinOut";
import { DEFAULT_SLIPPAGE_AMOUNT } from "./applySlippageToMinOut";

import {
  GMX_READER,
  DATA_STORE,
  ZERO_ADDRESS,
  GM_MARKET,
  GM_ADDRESS,
} from "@/constants/gm";

export const getWithdrawalAmounts = async (amount, provider) => {
  const GMXReaderContract = new Contract(GMX_READER, GMXReaderAbi, provider);

  const marketInfo = await getMarketInfo(provider);

  const gmarketTokenAmount = amount;
  const uiFeeReceiver = ZERO_ADDRESS;

  const prices = await getContractMarketPrices(marketInfo);

  const { shortAmountOut, longAmountOut } =
    await GMXReaderContract.getWithdrawalAmountOut(
      DATA_STORE,
      marketInfo,
      prices,
      gmarketTokenAmount,
      uiFeeReceiver
    );

  const { longTokenPrice, shortTokenPrice } = prices;

  const longAmountOutUsd = longAmountOut.mul(longTokenPrice.min); // 30 decimals
  const covertedLongAmountOut = longAmountOutUsd.div(shortTokenPrice.max); // 6 decimals

  return {
    shortAmountOut: shortAmountOut.div(100).mul(99),
    longAmountOut: covertedLongAmountOut,
  };
};

// TODO optimize helpers
export const getWithdrawalAmountsByMarket = async (
  marketTokenAmount,
  provider
) => {
  const dataStoreContract = new Contract(DATA_STORE, DataStoreAbi, provider);

  const marketTokenContract = new Contract(GM_ADDRESS, ERC20, provider);
  const marketTokenTotalSupply = await marketTokenContract.totalSupply();

  const marketInfo = await getMarketInfo(provider);
  const prices = await getContractMarketPrices(marketInfo);
  const { marketTokenPriceMax } = await getMarkeTokemPrice(
    marketInfo,
    prices,
    provider
  );
  const swapFeeFactorForNegativeImpact = await dataStoreContract.getUint(
    swapFeeFactorKey(GM_MARKET, false)
  );

  // 30 decimals
  const parsedPrices = {
    indexTokenPrice: {
      min: prices.indexTokenPrice.min.mul(expandDecimals(1, 18)),
      max: prices.indexTokenPrice.max.mul(expandDecimals(1, 18)),
    },
    longTokenPrice: {
      min: prices.longTokenPrice.min.mul(expandDecimals(1, 18)),
      max: prices.longTokenPrice.max.mul(expandDecimals(1, 18)),
    },
    shortTokenPrice: {
      min: prices.shortTokenPrice.min.mul(expandDecimals(1, 6)),
      max: prices.shortTokenPrice.max.mul(expandDecimals(1, 6)),
    },
  };

  const longPoolAmount = await dataStoreContract.getUint(
    poolAmountKey(GM_MARKET, marketInfo.longToken)
  );
  const shortPoolAmount = await dataStoreContract.getUint(
    poolAmountKey(GM_MARKET, marketInfo.shortToken)
  );

  const longPoolUsd = convertToUsd(
    longPoolAmount,
    18,
    parsedPrices.longTokenPrice.max
  );

  const shortPoolUsd = convertToUsd(
    shortPoolAmount,
    6,
    parsedPrices.shortTokenPrice.max
  );

  const totalPoolUsd = longPoolUsd.add(shortPoolUsd);

  const values = {
    marketTokenAmount: BigNumber.from(0),
    marketTokenUsd: BigNumber.from(0),
    longTokenAmount: BigNumber.from(0),
    longTokenUsd: BigNumber.from(0),
    shortTokenAmount: BigNumber.from(0),
    shortTokenUsd: BigNumber.from(0),
    swapFeeUsd: BigNumber.from(0),
    swapPriceImpactDeltaUsd: BigNumber.from(0),
  };

  if (totalPoolUsd.eq(0)) {
    return values;
  }

  values.marketTokenAmount = marketTokenAmount;

  values.marketTokenUsd = marketTokenAmountToUsd(
    marketTokenTotalSupply,
    marketTokenPriceMax[1].poolValue,
    marketTokenAmount
  );

  values.longTokenUsd = values.marketTokenUsd
    .mul(longPoolUsd)
    .div(totalPoolUsd);
  values.shortTokenUsd = values.marketTokenUsd
    .mul(shortPoolUsd)
    .div(totalPoolUsd);

  const longSwapFeeUsd = applyFactor(
    values.longTokenUsd,
    swapFeeFactorForNegativeImpact
  );
  const shortSwapFeeUsd = applyFactor(
    values.shortTokenUsd,
    swapFeeFactorForNegativeImpact
  );

  values.swapFeeUsd = longSwapFeeUsd.add(shortSwapFeeUsd);

  values.longTokenUsd = values.longTokenUsd.sub(longSwapFeeUsd);
  values.shortTokenUsd = values.shortTokenUsd.sub(shortSwapFeeUsd);

  values.longTokenAmount = convertToTokenAmount(
    values.longTokenUsd,
    6,
    parsedPrices.shortTokenPrice.max
  );

  values.shortTokenAmount = convertToTokenAmount(
    values.shortTokenUsd,
    6,
    parsedPrices.shortTokenPrice.max
  );

  return {
    shortAmountOut: applySlippageToMinOut(DEFAULT_SLIPPAGE_AMOUNT, values.shortTokenAmount),
    longAmountOut: applySlippageToMinOut(100, values.longTokenAmount),
  };
};
export default getWithdrawalAmounts;
