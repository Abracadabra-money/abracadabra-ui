import {
  getPriceImpactForSwap,
  applySwapImpactWithCap,
} from "./trade/priceImpact";
import { getSwapFee } from "./trade/getSwapFee";

import { usdToMarketTokenAmount } from "./marketTokenAmountToUsd";

import { convertToTokenAmount, convertToUsd, getMidPrice } from "./utils";
import { BigNumber } from "ethers";
import { applyFactor } from "./fee/applyFactor";

import type { DepositMarketInfo, MarketToken } from "./types";

export function getDepositAmounts(
  marketInfo: DepositMarketInfo,
  marketToken: MarketToken,
  longTokenAmount: BigNumber,
  shortTokenAmount: BigNumber,
  strategy: "byCollaterals",
  uiFeeFactor: BigNumber
) {
  const longTokenPrice = getMidPrice(marketInfo.prices.longTokenPrice);
  const shortTokenPrice = getMidPrice(marketInfo.prices.shortTokenPrice);

  const values = {
    longTokenAmount: BigNumber.from(0),
    longTokenUsd: BigNumber.from(0),
    shortTokenAmount: BigNumber.from(0),
    shortTokenUsd: BigNumber.from(0),
    marketTokenAmount: BigNumber.from(0),
    marketTokenUsd: BigNumber.from(0),
    swapFeeUsd: BigNumber.from(0),
    uiFeeUsd: BigNumber.from(0),
    swapPriceImpactDeltaUsd: BigNumber.from(0),
  };

  if (strategy === "byCollaterals") {
    if (longTokenAmount.eq(0) && shortTokenAmount.eq(0)) {
      return values;
    }

    values.longTokenAmount = longTokenAmount;
    values.longTokenUsd = convertToUsd(
      longTokenAmount,
      marketInfo.longTokenDecimals,
      longTokenPrice
    )!;
    values.shortTokenAmount = shortTokenAmount;
    values.shortTokenUsd = convertToUsd(
      shortTokenAmount,
      marketInfo.shortTokenDecimals,
      shortTokenPrice
    )!;

    values.swapPriceImpactDeltaUsd = getPriceImpactForSwap(
      marketInfo,
      marketInfo.longTokenAddress,
      marketInfo.shortTokenAddress,
      values.longTokenUsd,
      values.shortTokenUsd
    );

    const totalDepositUsd = values.longTokenUsd.add(values.shortTokenUsd);

    if (values.longTokenUsd.gt(0)) {
      const swapFeeUsd = getSwapFee(
        marketInfo,
        values.longTokenUsd,
        values.swapPriceImpactDeltaUsd.gt(0)
      );
      values.swapFeeUsd = values.swapFeeUsd.add(swapFeeUsd);

      const uiFeeUsd = applyFactor(values.longTokenUsd, uiFeeFactor);
      values.uiFeeUsd = values.uiFeeUsd.add(uiFeeUsd);

      values.marketTokenAmount = values.marketTokenAmount.add(
        getMarketTokenAmountByCollateral(
          marketInfo,
          marketToken,
          {
            type: "long",
            prices: marketInfo.prices.longTokenPrice,
            decimals: marketInfo.longTokenDecimals,
          },
          {
            type: "short",
            prices: marketInfo.prices.shortTokenPrice,
            decimals: marketInfo.shortTokenDecimals,
          },
          values.longTokenAmount,
          values.swapPriceImpactDeltaUsd
            .mul(values.longTokenUsd)
            .div(totalDepositUsd),
          swapFeeUsd,
          uiFeeUsd
        )
      );
    }

    if (values.shortTokenUsd.gt(0)) {
      const swapFeeUsd = getSwapFee(
        marketInfo,
        values.shortTokenUsd,
        values.swapPriceImpactDeltaUsd.gt(0)
      );
      values.swapFeeUsd = values.swapFeeUsd.add(swapFeeUsd);

      const uiFeeUsd = applyFactor(values.shortTokenUsd, uiFeeFactor);
      values.uiFeeUsd = values.uiFeeUsd.add(uiFeeUsd);

      values.marketTokenAmount = values.marketTokenAmount.add(
        getMarketTokenAmountByCollateral(
          marketInfo,
          marketToken,
          {
            type: "short",
            prices: marketInfo.prices.shortTokenPrice,
            decimals: marketInfo.shortTokenDecimals,
          },
          {
            type: "long",
            prices: marketInfo.prices.longTokenPrice,
            decimals: marketInfo.longTokenDecimals,
          },
          values.shortTokenAmount,
          values.swapPriceImpactDeltaUsd
            .mul(values.shortTokenUsd)
            .div(totalDepositUsd),
          swapFeeUsd,
          uiFeeUsd
        )
      );
    }

    values.marketTokenUsd = convertToUsd(
      values.marketTokenAmount,
      18, // notice
      marketToken.prices.min
    )!;
  }

  return values;
}

function getMarketTokenAmountByCollateral(
  marketInfo: DepositMarketInfo,
  marketToken: MarketToken,
  tokenIn: any,
  tokenOut: any,
  amount: BigNumber,
  priceImpactDeltaUsd: BigNumber,
  swapFeeUsd: BigNumber,
  uiFeeUsd: BigNumber
): BigNumber {
  const swapFeeAmount = convertToTokenAmount(
    swapFeeUsd,
    tokenIn.decimals,
    tokenIn.prices.min
  )!;
  const uiFeeAmount = convertToTokenAmount(
    uiFeeUsd,
    tokenIn.decimals,
    tokenIn.prices.min
  )!;

  let amountInAfterFees = amount.sub(swapFeeAmount).sub(uiFeeAmount);
  let mintAmount = BigNumber.from(0);

  if (priceImpactDeltaUsd.gt(0)) {
    const positiveImpactAmount = applySwapImpactWithCap(
      marketInfo,
      tokenOut,
      priceImpactDeltaUsd
    );

    const usdValue = convertToUsd(
      positiveImpactAmount,
      tokenOut.decimals,
      tokenOut.prices.max
    )!;

    mintAmount = mintAmount.add(
      // TODO: poolValue for deposit
      usdToMarketTokenAmount(
        marketToken.totalSupply,
        marketInfo.poolValueMax,
        usdValue
      )
    );
  } else {
    const negativeImpactAmount = applySwapImpactWithCap(
      marketInfo,
      tokenIn,
      priceImpactDeltaUsd
    );
    amountInAfterFees = amountInAfterFees.sub(negativeImpactAmount.mul(-1));
  }

  const usdValue = convertToUsd(
    amountInAfterFees,
    tokenIn.decimals,
    tokenIn.prices.min
  )!;
  mintAmount = mintAmount.add(
    usdToMarketTokenAmount(
      marketToken.totalSupply,
      marketInfo.poolValueMax,
      usdValue
    )
  );

  return mintAmount;
}
