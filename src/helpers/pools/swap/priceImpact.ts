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

  return Number(priceImpact);
};

export const calculatePriceImpact = (
  routesInfo: any[] = [] //
): number => {
  if (!routesInfo.length) return 0;

  return routesInfo.reduce((acc, step) => acc + step.priceImpact, 0);
};
