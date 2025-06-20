import { formatUnits } from "viem";
import type { MagicLPInfo } from "@/helpers/pools/swap/types";

export const calculatePriceImpactSingleSwap = (
  pool: MagicLPInfo,
  amountIn: bigint,
  amountOut: bigint,
  fromBase: boolean
): number => {
  if (amountIn === 0n || amountOut === 0n) return 0;

  const { midPrice } = pool;

  const baseTokenDecimals = pool.config.baseToken.decimals;
  const quoteTokenDecimals = pool.config.quoteToken.decimals;

  const parsedAmountIn = formatUnits(
    amountIn,
    fromBase ? baseTokenDecimals : quoteTokenDecimals
  );

  const parsedAmountOut = formatUnits(
    amountOut,
    fromBase ? quoteTokenDecimals : baseTokenDecimals
  );

  const executionPrice = Number(parsedAmountOut) / Number(parsedAmountIn);

  const midPriceCorrected = fromBase ? midPrice : 1 / midPrice;

  const priceImpact = Math.abs(
    ((executionPrice - midPriceCorrected) / midPriceCorrected) * 100
  );

  console.log(
    `Swap data: midPrice: ${midPrice}, parsedAmountIn:${parsedAmountIn}, parsedAmountOut:${parsedAmountOut}, executionPrice: ${executionPrice}, priceImpact: ${priceImpact}`
  );

  console.log(`Price impact on ${pool.name} - ${priceImpact}`);
  return Number(priceImpact);
};

export const calculatePriceImpact = (
  routesInfo: { priceImpact: number }[] = []
): number => {
  if (!routesInfo.length) return 0;

  const combined = routesInfo.reduce((acc, step) => {
    const impact = (step.priceImpact ?? 0) / 100;
    if (!impact) return acc;

    return acc * (1 - impact);
  }, 1);

  const totalImpact = 1 - combined;

  console.log(`\nTotal Price impact: ${(totalImpact * 100).toFixed(2)}%`);

  return totalImpact * 100;
};
