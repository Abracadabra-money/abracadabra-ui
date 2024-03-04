import type { Address } from "viem";
import type { MagicLPInfo } from "./types";
import { divFloor, mulFloor } from "./libs/DecimalMath";

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

  if (baseInAmount == 0n) {
    return {
      baseAdjustedInAmount: 0n,
      quoteAdjustedInAmount: 0n,
      shares: 0n,
    };
  }

  const { vaultReserve, totalSupply, PMMState } = lpInfo;
  const { i } = PMMState; // TODO

  const baseReserve = vaultReserve[0]; // TODO
  const quoteReserve = vaultReserve[1]; // TODO

  if (totalSupply == 0n) {
    const baseBalance = baseReserve + baseInAmount;
    const quoteBalance = quoteReserve + quoteInAmount;

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
    const baseInputRatio = divFloor(baseInAmount, baseReserve);
    const quoteInputRatio = divFloor(quoteInAmount, quoteReserve);
    if (baseInputRatio <= quoteInputRatio) {
      result.baseAdjustedInAmount = baseInAmount;
      result.quoteAdjustedInAmount = mulFloor(quoteReserve, baseInputRatio);
      result.shares = mulFloor(totalSupply, baseInputRatio);
    } else {
      result.quoteAdjustedInAmount = quoteInAmount;
      result.baseAdjustedInAmount = mulFloor(baseReserve, quoteInputRatio);
      result.shares = mulFloor(totalSupply, quoteInputRatio);
    }
  }

  return result;
};

export const previewRemoveLiquidity = (
  sharesIn: bigint,
  lpInfo: MagicLPInfo
) => {
  const { vaultReserve, totalSupply } = lpInfo;

  const baseBalance = vaultReserve[0]; // TODO
  const quoteBalance = vaultReserve[1]; // TODO
  const totalShares = totalSupply;

  return {
    baseAmountOut: (baseBalance * sharesIn) / totalShares,
    quoteAmountOut: (quoteBalance * sharesIn) / totalShares,
  };
};
