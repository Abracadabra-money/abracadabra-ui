import type { MagicLPInfo } from "./types";
import DecimalMath, { divFloor, mulFloor, mulCeil } from "./libs/DecimalMath";
import { querySellQuote, querySellBase } from "@/helpers/pools/swap/magicLp";

export const previewAddLiquidity = (
  baseInAmount: bigint,
  quoteInAmount: bigint,
  lpInfo: MagicLPInfo
) => {
  const result = {
    baseAdjustedInAmount: 0n,
    quoteAdjustedInAmount: 0n,
    shares: 0n,
  };

  const { vaultReserve, totalSupply, PMMState, balances } = lpInfo;
  const { i } = PMMState; // TODO

  const baseReserve = vaultReserve[0]; // TODO
  const quoteReserve = vaultReserve[1]; // TODO

  const baseBalance = balances.baseBalance + baseInAmount;
  const quoteBalance = balances.quoteBalance + quoteInAmount;

  const baseInAmountUpdated = baseBalance - baseReserve;
  const quoteInAmountUpdated = quoteBalance - quoteReserve;

  if (baseInAmountUpdated == 0n) {
    return {
      baseAdjustedInAmount: 0n,
      quoteAdjustedInAmount: 0n,
      shares: 0n,
    };
  }

  if (totalSupply == 0n) {
    if (quoteBalance == 0n) {
      return {
        baseAdjustedInAmount: 0n,
        quoteAdjustedInAmount: 0n,
        shares: 0n,
      };
    }

    result.shares =
      quoteBalance < mulFloor(baseBalance, i)
        ? divFloor(quoteBalance, i)
        : baseBalance;
    result.baseAdjustedInAmount = result.shares;
    result.quoteAdjustedInAmount = mulFloor(result.shares, i);

    if (result.shares <= 2001n) {
      return {
        baseAdjustedInAmount: 0n,
        quoteAdjustedInAmount: 0n,
        shares: 0n,
      };
    }

    result.shares -= BigInt(1001);
  } else if (baseReserve > 0n && quoteReserve > 0n) {
    const baseInputRatio = divFloor(baseInAmountUpdated, baseReserve);
    const quoteInputRatio = divFloor(quoteInAmountUpdated, quoteReserve);

    if (baseInputRatio < quoteInputRatio) {
      result.baseAdjustedInAmount = baseInAmountUpdated;
      result.quoteAdjustedInAmount = mulCeil(quoteReserve, baseInputRatio);
      result.shares = mulFloor(totalSupply, baseInputRatio);
    } else if (baseInputRatio > quoteInputRatio) {
      result.quoteAdjustedInAmount = quoteInAmountUpdated;
      result.baseAdjustedInAmount = mulCeil(baseReserve, quoteInputRatio);
      result.shares = mulFloor(totalSupply, quoteInputRatio);
    } else {
      // Notice: this is added by FE, to make avoid input update loop
      result.baseAdjustedInAmount = baseInAmountUpdated;
      result.quoteAdjustedInAmount = quoteInAmountUpdated;
      result.shares = mulFloor(totalSupply, baseInputRatio);
    }
  }

  return result;
};

export const previewRemoveLiquidity = (
  sharesIn: bigint,
  lpInfo: MagicLPInfo
) => {
  const { totalSupply, balances } = lpInfo;

  const { baseBalance, quoteBalance } = balances;
  const totalShares = totalSupply;

  return {
    baseAmountOut: (baseBalance * sharesIn) / totalShares,
    quoteAmountOut: (quoteBalance * sharesIn) / totalShares,
  };
};

// Alternative implementation of addLiquidity

const adjustAddLiquidity = (
  baseInAmount: bigint,
  quoteInAmount: bigint,
  lpInfo: MagicLPInfo
) => {
  const { totalSupply, vaultReserve, PMMState, balances } = lpInfo;
  const { i } = PMMState;
  const baseReserve = vaultReserve[0]; // TODO
  const quoteReserve = vaultReserve[1]; // TODO

  let baseAdjustedInAmount = 0n;
  let quoteAdjustedInAmount = 0n;

  if (totalSupply == 0n) {
    const shares =
      quoteInAmount < DecimalMath.mulFloor(baseInAmount, i)
        ? DecimalMath.divFloor(quoteInAmount, i)
        : baseInAmount;
    baseAdjustedInAmount = shares;
    quoteAdjustedInAmount = DecimalMath.mulFloor(shares, i);
  } else {
    if (quoteReserve > 0n && baseReserve > 0n) {
      const baseIncreaseRatio = DecimalMath.divFloor(baseInAmount, baseReserve);
      const quoteIncreaseRatio = DecimalMath.divFloor(
        quoteInAmount,
        quoteReserve
      );
      if (baseIncreaseRatio < quoteIncreaseRatio) {
        baseAdjustedInAmount = baseInAmount;
        quoteAdjustedInAmount = DecimalMath.mulFloor(
          quoteReserve,
          baseIncreaseRatio
        );
      } else if (baseIncreaseRatio > quoteIncreaseRatio) {
        quoteAdjustedInAmount = quoteInAmount;
        baseAdjustedInAmount = DecimalMath.mulFloor(
          baseReserve,
          quoteIncreaseRatio
        );
      } else {
        // Notice: this is added by FE, to make avoid input update loop
        baseAdjustedInAmount = baseInAmount;
        quoteAdjustedInAmount = quoteInAmount;
      }
    }
  }

  return { baseAdjustedInAmount, quoteAdjustedInAmount };
};

const buyShares = (
  baseAdjustedInAmount: bigint,
  quoteAdjustedInAmount: bigint,
  lpInfo: MagicLPInfo
) => {
  const { vaultReserve, totalSupply, PMMState, balances } = lpInfo;
  const { i } = PMMState; // TODO

  const baseBalance = balances.baseBalance + baseAdjustedInAmount;
  const quoteBalance = balances.quoteBalance + quoteAdjustedInAmount;

  const baseReserve = vaultReserve[0]; // TODO
  const quoteReserve = vaultReserve[1]; // TODO

  const baseInAmountUpdated = baseBalance - baseReserve;
  const quoteInAmountUpdated = quoteBalance - quoteReserve;

  let shares = 0n;
  if (baseInAmountUpdated == 0n) {
    return {
      baseAdjustedInAmount: 0n,
      quoteAdjustedInAmount: 0n,
      shares: 0n,
    };
  }

  if (totalSupply == 0n) {
    if (quoteBalance == 0n) {
      return {
        baseAdjustedInAmount: 0n,
        quoteAdjustedInAmount: 0n,
        shares: 0n,
      };
    }

    shares =
      quoteBalance < mulFloor(baseBalance, i)
        ? divFloor(quoteBalance, i)
        : baseBalance;

    const _QUOTE_TARGET_ = DecimalMath.mulFloor(shares, i);

    if (_QUOTE_TARGET_ == 0n) {
      console.log("buyShares: ErrZeroQuoteTarget");
      return {
        baseAdjustedInAmount: 0n,
        quoteAdjustedInAmount: 0n,
        shares: 0n,
      };
    }

    if (shares <= 2001n) {
      console.log("buyShares: ErrMintAmountNotEnough");
      return {
        baseAdjustedInAmount: 0n,
        quoteAdjustedInAmount: 0n,
        shares: 0n,
      };
    }

    shares -= BigInt(1001);
  } else if (baseReserve > 0n && quoteReserve > 0n) {
    const baseInputRatio = divFloor(baseInAmountUpdated, baseReserve);
    const quoteInputRatio = divFloor(quoteInAmountUpdated, quoteReserve);

    const mintRatio =
      quoteInputRatio < baseInputRatio ? quoteInputRatio : baseInputRatio;
    shares = DecimalMath.mulFloor(totalSupply, mintRatio);
  }

  return { shares, baseAdjustedInAmount, quoteAdjustedInAmount };
};

export const previewAddLiquidityAlternative = (
  baseInAmount: bigint,
  quoteInAmount: bigint,
  lpInfo: MagicLPInfo
) => {
  const { baseAdjustedInAmount, quoteAdjustedInAmount } = adjustAddLiquidity(
    baseInAmount,
    quoteInAmount,
    lpInfo
  );
  return buyShares(baseAdjustedInAmount, quoteAdjustedInAmount, lpInfo);
};

export const previewAddLiquiditySingleSide = (
  lpInfo: MagicLPInfo,
  inAmount: bigint,
  inAmountToSwap: bigint,
  inAmountIsBase: boolean
) => {
  let baseAmount = 0n;
  let quoteAmount = 0n;

  // base -> quote
  if (inAmountIsBase) {
    baseAmount = inAmount - inAmountToSwap;
    quoteAmount = querySellBase(
      inAmountToSwap,
      lpInfo,
      lpInfo.userInfo
    ).receiveQuoteAmount;
  }
  // quote -> base
  else {
    quoteAmount = inAmount - inAmountToSwap;
    baseAmount = querySellQuote(
      inAmountToSwap,
      lpInfo,
      lpInfo.userInfo
    ).receiveBaseAmount;
  }

  const previewAddLiquidityResult = previewAddLiquidity(
    baseAmount,
    quoteAmount,
    lpInfo
  );

  return previewAddLiquidityResult;
};
