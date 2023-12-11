import { BigNumber } from "ethers";
// V2
export const HIGH_PRICE_IMPACT_BPS = 80; // 0.8%
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

const getFees = async (amounts: any, isDeposit: boolean) => {
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
  const fees: GmSwapFees = {
    swapFee,
    swapPriceImpact,
    totalFees,
    uiFee,
  };

  return {
    fees,
  };
};

export function getIsHighPriceImpact(
  positionPriceImpact?: FeeItem,
  swapPriceImpact?: FeeItem
) {
  const totalPriceImpact = getTotalFeeItem([
    positionPriceImpact,
    swapPriceImpact,
  ]);
  return (
    totalPriceImpact.deltaUsd.lt(0) &&
    totalPriceImpact.bps.abs().gte(HIGH_PRICE_IMPACT_BPS)
  );
}

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
