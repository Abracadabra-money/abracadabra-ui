import { BigNumber } from "ethers";
import { getMidPrice } from "../utils";
import { convertToUsd } from "../utils";
import { bigNumberify, expandDecimals } from "../fee/expandDecials";
import { convertToTokenAmount, roundUpMagnitudeDivision } from "../utils";

export const getPriceImpactForSwap = (
  marketInfo,
  tokenA,
  tokenB,
  usdDeltaTokenA,
  usdDeltaTokenB,
) => {
  const tokenAPoolType = "long";
  const tokenBPoolType = "short";

  const [longToken, shortToken] =
    tokenAPoolType === "long" ? [tokenA, tokenB] : [tokenB, tokenA];
  const [longDeltaUsd, shortDeltaUsd] =
    tokenAPoolType === "long"
      ? [usdDeltaTokenA, usdDeltaTokenB]
      : [usdDeltaTokenB, usdDeltaTokenA];

  const { longPoolUsd, shortPoolUsd, nextLongPoolUsd, nextShortPoolUsd } =
    getNextPoolAmountsParams({
      marketInfo,
      longPoolAmount: marketInfo.longPoolAmount,
      shortPoolAmount: marketInfo.shortPoolAmount,
      longDeltaUsd,
      shortDeltaUsd,
    });

  const priceImpactUsd = getPriceImpactUsd({
    currentLongUsd: longPoolUsd,
    currentShortUsd: shortPoolUsd,
    nextLongUsd: nextLongPoolUsd,
    nextShortUsd: nextShortPoolUsd,
    factorPositive: marketInfo.swapImpactFactorPositive,
    factorNegative: marketInfo.swapImpactFactorNegative,
    exponentFactor: marketInfo.swapImpactExponentFactor,
  });

  if (priceImpactUsd.gt(0)) {
    return priceImpactUsd;
  }

  const virtualInventoryLong = marketInfo.virtualPoolAmountForLongToken;
  const virtualInventoryShort = marketInfo.virtualPoolAmountForShortToken;

  if (!virtualInventoryLong.gt(0) || !virtualInventoryShort.gt(0)) {
    return priceImpactUsd;
  }

  const virtualInventoryParams = getNextPoolAmountsParams({
    marketInfo,
    longPoolAmount: virtualInventoryLong,
    shortPoolAmount: virtualInventoryShort,
    longDeltaUsd,
    shortDeltaUsd,
  });

  const priceImpactUsdForVirtualInventory = getPriceImpactUsd({
    currentLongUsd: virtualInventoryParams.longPoolUsd,
    currentShortUsd: virtualInventoryParams.shortPoolUsd,
    nextLongUsd: virtualInventoryParams.nextLongPoolUsd,
    nextShortUsd: virtualInventoryParams.nextShortPoolUsd,
    factorPositive: marketInfo.swapImpactFactorPositive,
    factorNegative: marketInfo.swapImpactFactorNegative,
    exponentFactor: marketInfo.swapImpactExponentFactor,
  });

  return priceImpactUsdForVirtualInventory.lt(priceImpactUsd)
    ? priceImpactUsdForVirtualInventory
    : priceImpactUsd;
};


export const getNextPoolAmountsParams = ({
  marketInfo,
  longPoolAmount,
  shortPoolAmount,
  longDeltaUsd,
  shortDeltaUsd,
}) => {
  const longPrice = getMidPrice(marketInfo.prices.longTokenPrice);
  const shortPrice = getMidPrice(marketInfo.prices.shortTokenPrice);

  const longPoolUsd = convertToUsd(longPoolAmount, marketInfo.longTokenDecimals, longPrice);
  const shortPoolUsd = convertToUsd(shortPoolAmount, marketInfo.shortTokenDecimals, shortPrice);

  const longPoolUsdAdjustment = convertToUsd(
    marketInfo.longPoolAmountAdjustment,
    marketInfo.longTokenDecimals,
    longPrice
  );
  const shortPoolUsdAdjustment = convertToUsd(
    marketInfo.shortPoolAmountAdjustment,
    marketInfo.shortTokenDecimals,
    shortPrice
  );

  const nextLongPoolUsd = longPoolUsd
    .add(longDeltaUsd)
    .add(longPoolUsdAdjustment);
  const nextShortPoolUsd = shortPoolUsd
    .add(shortDeltaUsd)
    .add(shortPoolUsdAdjustment);

  return {
    longPoolUsd,
    shortPoolUsd,
    nextLongPoolUsd,
    nextShortPoolUsd,
  };
};

export const getPriceImpactUsd = ({
  currentLongUsd,
  currentShortUsd,
  nextLongUsd,
  nextShortUsd,
  factorPositive,
  factorNegative,
  exponentFactor,
}) => {
  if (nextLongUsd.lt(0) || nextShortUsd.lt(0)) {
    throw new Error("Negative pool amount");
  }

  const currentDiff = currentLongUsd.sub(currentShortUsd).abs();
  const nextDiff = nextLongUsd.sub(nextShortUsd).abs();

  const isSameSideRebalance =
    currentLongUsd.lt(currentShortUsd) === nextLongUsd.lt(nextShortUsd);

  let impactUsd;

  if (isSameSideRebalance) {
    const hasPositiveImpact = nextDiff.lt(currentDiff);
    const factor = hasPositiveImpact ? factorPositive : factorNegative;

    impactUsd = calculateImpactForSameSideRebalance({
      currentDiff,
      nextDiff,
      hasPositiveImpact,
      factor,
      exponentFactor,
    });
  } else {
    impactUsd = calculateImpactForCrossoverRebalance({
      currentDiff,
      nextDiff,
      factorPositive,
      factorNegative,
      exponentFactor,
    });
  }

  return impactUsd;
};

export const applySwapImpactWithCap = (
  marketInfo,
  token,
  priceImpactDeltaUsd
) => {
  const tokenPoolType = token.type;

  const isLongCollateral = tokenPoolType === "long";
  const price = priceImpactDeltaUsd.gt(0) ? token.prices.max : token.prices.min;

  let impactDeltaAmount;

  if (priceImpactDeltaUsd.gt(0)) {
    // round positive impactAmount down, this will be deducted from the swap impact pool for the user
    impactDeltaAmount = convertToTokenAmount(
      priceImpactDeltaUsd,
      token.decimals,
      price
    );

    const maxImpactAmount = isLongCollateral
      ? marketInfo.swapImpactPoolAmountLong
      : marketInfo.swapImpactPoolAmountShort;

    if (impactDeltaAmount.gt(maxImpactAmount)) {
      impactDeltaAmount = maxImpactAmount;
    }
  } else {
    // round negative impactAmount up, this will be deducted from the user
    impactDeltaAmount = roundUpMagnitudeDivision(
      priceImpactDeltaUsd.mul(expandDecimals(1, token.decimals)),
      price
    );
  }

  return impactDeltaAmount;
};

export function calculateImpactForSameSideRebalance({
  currentDiff,
  nextDiff,
  hasPositiveImpact,
  factor,
  exponentFactor,
}) {
  const currentImpact = applyImpactFactor(currentDiff, factor, exponentFactor);
  const nextImpact = applyImpactFactor(nextDiff, factor, exponentFactor);

  const deltaDiff = currentImpact.sub(nextImpact).abs();

  return hasPositiveImpact ? deltaDiff : BigNumber.from(0).sub(deltaDiff);
}

export function calculateImpactForCrossoverRebalance({
  currentDiff,
  nextDiff,
  factorPositive,
  factorNegative,
  exponentFactor,
}) {
  const positiveImpact = applyImpactFactor(
    currentDiff,
    factorPositive,
    exponentFactor
  );
  const negativeImpactUsd = applyImpactFactor(
    nextDiff,
    factorNegative,
    exponentFactor
  );

  const deltaDiffUsd = positiveImpact.sub(negativeImpactUsd).abs();

  return positiveImpact.gt(negativeImpactUsd)
    ? deltaDiffUsd
    : BigNumber.from(0).sub(deltaDiffUsd);
}

export function applyImpactFactor(diff, factor, exponent) {
  // Convert diff and exponent to float js numbers
  const _diff = Number(diff) / 10 ** 30;
  const _exponent = Number(exponent) / 10 ** 30;

  // Pow and convert back to BigNumber with 30 decimals
  let result = bigNumberify(BigInt(Math.round(_diff ** _exponent * 10 ** 30)));

  result = result.mul(factor).div(expandDecimals(1, 30));

  return result;
}
