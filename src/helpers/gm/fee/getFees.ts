import { BigNumber } from "ethers";
// V2
export const HIGH_PRICE_IMPACT_BPS = 80; // 0.8%
export const HIGH_PRICE_IMPACT_BPS_TRADE = 150; // 1.5%
export const DEFAULT_ACCEPABLE_PRICE_IMPACT_BPS = 100; // 1%
export const BASIS_POINTS_DIVISOR = 10000;

export type FeeItem = {
  deltaUsd: BigNumber;
  bps: BigNumber;
};

export type GmSwapFees = {
  totalFees?: FeeItem;
  swapFee?: FeeItem;
  swapPriceImpact?: FeeItem;
  uiFee?: FeeItem;
};

// Use for basic deposit/withdraw of tokens in GM
export const getFees = (amounts: any, isDeposit: boolean) => {
  const basisUsd = isDeposit
    ? BigNumber.from(0)
        .add(amounts?.longTokenUsd || 0)
        .add(amounts?.shortTokenUsd || 0)
    : amounts?.marketTokenUsd || BigNumber.from(0);

  const swapFee = getFeeItem(amounts.swapFeeUsd?.mul(-1), basisUsd);
  const swapPriceImpact = getFeeItem(amounts.swapPriceImpactDeltaUsd, basisUsd);
  const uiFee = getFeeItem(amounts.uiFeeUsd.mul(-1), basisUsd, {
    shouldRoundUp: true,
  });

  const totalFees = getTotalFeeItem(
    [swapPriceImpact, swapFee, uiFee].filter(Boolean) as FeeItem[]
  );

  const isHighPriceImpact =
    swapPriceImpact?.deltaUsd.lt(0) &&
    swapPriceImpact.bps.abs().gte(HIGH_PRICE_IMPACT_BPS);

  const fees: GmSwapFees = {
    swapFee,
    swapPriceImpact,
    totalFees,
    uiFee,
  };

  return { fees, isHighPriceImpact };
};

// Use for swap
export const getTradeFees = (amounts: any) => {
  const initialCollateralUsd = amounts.usdIn;
  const swapSteps = amounts.swapPathStats.swapSteps;
  const swapPriceImpactDeltaUsd =
    amounts.swapPathStats.totalSwapPriceImpactDeltaUsd;

  const swapFees = initialCollateralUsd.gt(0)
    ? swapSteps.map((step: any) => ({
        tokenInAddress: step.tokenInAddress,
        tokenOutAddress: step.tokenOutAddress,
        marketAddress: step.marketAddress,
        deltaUsd: step.swapFeeUsd.mul(-1),
        bps: !step.usdIn.eq(0)
          ? getBasisPoints(step.swapFeeUsd.mul(-1), step.usdIn)
          : BigNumber.from(0),
      }))
    : undefined;

  const swapPriceImpact = getFeeItem(
    swapPriceImpactDeltaUsd,
    initialCollateralUsd
  );

  const isHighPriceImpact =
    swapPriceImpact?.deltaUsd.lt(0) &&
    swapPriceImpact.bps.abs().gte(HIGH_PRICE_IMPACT_BPS_TRADE);

  return { swapFees, swapPriceImpact, isHighPriceImpact };
};

export function getFeeItem(
  feeDeltaUsd?: BigNumber,
  basis?: BigNumber,
  opts: { shouldRoundUp?: boolean } = {}
): FeeItem | undefined {
  const { shouldRoundUp = false } = opts;
  if (!feeDeltaUsd) return undefined;

  return {
    deltaUsd: feeDeltaUsd,
    bps: basis?.gt(0)
      ? getBasisPoints(feeDeltaUsd, basis, shouldRoundUp)
      : BigNumber.from(0),
  };
}

export function getTotalFeeItem(feeItems: (FeeItem | undefined)[]): FeeItem {
  const totalFeeItem: FeeItem = {
    deltaUsd: BigNumber.from(0),
    bps: BigNumber.from(0),
  };

  (feeItems.filter(Boolean) as FeeItem[]).forEach((feeItem) => {
    totalFeeItem.deltaUsd = totalFeeItem.deltaUsd.add(feeItem.deltaUsd);
    totalFeeItem.bps = totalFeeItem.bps.add(feeItem.bps);
  });

  return totalFeeItem;
}

export function getBasisPoints(
  numerator: BigNumber,
  denominator: BigNumber,
  shouldRoundUp = false
) {
  const result = numerator.mul(BASIS_POINTS_DIVISOR).div(denominator);

  if (shouldRoundUp) {
    const remainder = numerator.mul(BASIS_POINTS_DIVISOR).mod(denominator);
    if (!remainder.isZero()) {
      return result.isNegative() ? result.sub(1) : result.add(1);
    }
  }

  return result;
}
