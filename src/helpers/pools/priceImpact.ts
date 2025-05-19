import type { MagicLPInfo } from "@/helpers/pools/swap/types";
import { formatUnits } from "viem";

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
  routesInfo: any[] = [] //
): number => {
  if (!routesInfo.length) {
    return 0;
  }

  let totalImpact = 0;

  routesInfo.forEach((step) => {
    totalImpact += step.priceImpact;
  });

  console.log(`\nTotal Price impact: ${totalImpact.toFixed(2)}%`);

  return totalImpact;
};
