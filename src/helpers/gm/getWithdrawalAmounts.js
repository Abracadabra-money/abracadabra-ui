import { Contract, BigNumber } from "ethers";

import ERC20 from "@/utils/zeroXSwap/abi/ERC20";

import { convertToUsd, convertToTokenAmount } from "./utils";
import { applyFactor } from "./fee/applyFactor";
import { expandDecimals } from "./fee/expandDecials";
import { getMarkeTokemPrice } from "./getMarketPrice";
import { getContractMarketPrices } from "./getContractMarketPrices";
import { getMarketInfo, getMarketFullInfo } from "./getMarketInfo";
import { marketTokenAmountToUsd } from "./marketTokenAmountToUsd";
import { applySlippageToMinOut } from "./applySlippageToMinOut";
import { DEFAULT_SLIPPAGE_AMOUNT } from "./applySlippageToMinOut";

import { getSwapAmountsByFromValue } from "./trade/swap";

import { getDataStoreInfo } from "./getDataStoreInfo";

import { getSwapSpread } from "./trade/getSwapSpread";

const WBTC_ADDRESS = "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f";
const USDC_DECIMALS = 6;
const GM_DECIMALS = 18;
const WBTC_DECIMALS = 8;
const DEFAULT_DECIMALS = 18;

const getLongTokenDecimals = (longToken) => {
  if (longToken.toLowerCase() === WBTC_ADDRESS.toLocaleLowerCase())
    return WBTC_DECIMALS;
  return DEFAULT_DECIMALS;
};

export const getWithdrawalAmountsByMarket = async (
  market,
  marketTokenAmount,
  provider
) => {
  const marketTokenContract = new Contract(market, ERC20, provider);
  const marketTokenTotalSupply = await marketTokenContract.totalSupply();

  const marketInfo = await getMarketInfo(provider, market);

  const longTokenDecimals = getLongTokenDecimals(marketInfo.longToken);
  const shortTokenDecimals = USDC_DECIMALS; // always USDC
  const indexTokenDecimals = GM_DECIMALS;

  marketInfo.longTokenDecimals = longTokenDecimals;
  marketInfo.shortTokenDecimals = shortTokenDecimals;
  marketInfo.indexTokenDecimals = indexTokenDecimals;

  const prices = await getContractMarketPrices(marketInfo);

  const dataStoreInfo = await getDataStoreInfo(market, marketInfo, provider);

  const { marketTokenPriceMax } = await getMarkeTokemPrice(
    marketInfo,
    prices,
    provider
  );
  const parsedPrices = {
    indexTokenPrice: {
      min: prices.indexTokenPrice.min.mul(
        expandDecimals(1, indexTokenDecimals)
      ),
      max: prices.indexTokenPrice.max.mul(
        expandDecimals(1, indexTokenDecimals)
      ),
    },
    longTokenPrice: {
      min: prices.longTokenPrice.min.mul(expandDecimals(1, longTokenDecimals)),
      max: prices.longTokenPrice.max.mul(expandDecimals(1, longTokenDecimals)),
    },
    shortTokenPrice: {
      min: prices.shortTokenPrice.min.mul(
        expandDecimals(1, shortTokenDecimals)
      ),
      max: prices.shortTokenPrice.max.mul(
        expandDecimals(1, shortTokenDecimals)
      ),
    },
  };

  const longPoolUsd = convertToUsd(
    dataStoreInfo.longPoolAmount,
    longTokenDecimals,
    parsedPrices.longTokenPrice.max
  );

  const shortPoolUsd = convertToUsd(
    dataStoreInfo.shortPoolAmount,
    shortTokenDecimals,
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
    dataStoreInfo.swapFeeFactorForNegativeImpact
  );
  const shortSwapFeeUsd = applyFactor(
    values.shortTokenUsd,
    dataStoreInfo.swapFeeFactorForNegativeImpact
  );

  values.swapFeeUsd = longSwapFeeUsd.add(shortSwapFeeUsd);

  values.longTokenUsd = values.longTokenUsd.sub(longSwapFeeUsd);
  values.shortTokenUsd = values.shortTokenUsd.sub(shortSwapFeeUsd);

  values.shortTokenAmount = convertToTokenAmount(
    values.shortTokenUsd,
    shortTokenDecimals,
    parsedPrices.shortTokenPrice.max
  );

  // converted to short
  values.longTokenAmount = convertToTokenAmount(
    values.longTokenUsd,
    shortTokenDecimals,
    parsedPrices.shortTokenPrice.max
  );

  const fromTokenAmount = convertToTokenAmount(
    values.longTokenUsd,
    longTokenDecimals,
    parsedPrices.longTokenPrice.max
  );

  const { minOutputAmount } = await estimateLongToShortSwap(
    market,
    marketInfo,
    parsedPrices,
    dataStoreInfo,
    fromTokenAmount,
    provider
  );

  const swapMinOutputAmount = applySlippageToMinOut(
    DEFAULT_SLIPPAGE_AMOUNT * 2, // withdraw + swap
    minOutputAmount
  );

  const marketMinOutputAmount = applySlippageToMinOut(
    DEFAULT_SLIPPAGE_AMOUNT * 2, // withdraw + swap
    values.longTokenAmount
  );

  const longAmountOut = swapMinOutputAmount.gt(marketMinOutputAmount)
    ? marketMinOutputAmount
    : swapMinOutputAmount;

  const shortAmountOut = applySlippageToMinOut(
    DEFAULT_SLIPPAGE_AMOUNT,
    values.shortTokenAmount
  );

  return {
    shortAmountOut,
    longAmountOut,
  };
};

const estimateLongToShortSwap = async (
  market,
  marketInfo,
  prices,
  dataStoreInfo,
  fromTokenAmount,
  provider
) => {
  const marketFullInfo = await getMarketFullInfo(provider, prices, market);

  const virtualPoolAmountForLongToken =
    marketFullInfo.virtualInventory.virtualPoolAmountForLongToken;
  const virtualPoolAmountForShortToken =
    marketFullInfo.virtualInventory.virtualPoolAmountForShortToken;

  const longInterestInTokens =
    dataStoreInfo.longInterestInTokensUsingLongToken.add(
      dataStoreInfo.longInterestInTokensUsingShortToken
    );
  const shortInterestUsd = dataStoreInfo.shortInterestUsingLongToken.add(
    dataStoreInfo.shortInterestUsingShortToken
  );

  const marketInfoData = {
    longTokenAddress: marketInfo.longToken,
    shortTokenAddress: marketInfo.shortToken,
    longTokenDecimals: marketInfo.longTokenDecimals,
    shortTokenDecimals: marketInfo.shortTokenDecimals,
    indexTokenDecimals: marketInfo.indexTokenDecimals,
    marketTokenAddress: market,
    isSameCollaterals: false,
    isDisabled: false,
    prices,
    virtualPoolAmountForLongToken,
    virtualPoolAmountForShortToken,
    longInterestInTokens,
    shortInterestUsd,
    ...dataStoreInfo,
  };

  const swapAmounts = getSwapAmountsByFromValue({
    marketInfo: marketInfoData,
    market,
    tokenIn: marketInfo.longToken,
    tokenOut: marketInfo.shortToken,
    amountIn: fromTokenAmount,
  });

  return swapAmounts;
};
