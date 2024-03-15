import type { Address } from "viem";
import type { MagicLPInfo } from "./types";
import { divFloor, mulFloor, mulCeil } from "./libs/DecimalMath";

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
