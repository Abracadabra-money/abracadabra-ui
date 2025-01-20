import { TokenTypes, RATE_PRECISION } from "@/constants/pools/poolCreation";
import { parseUnits } from "viem";

export const invertIValueBasedOnUpdatedDecimals = (currentI: bigint, newDecimals: number, oldDecimals: number) => {
    return (currentI * parseUnits("1", newDecimals)) /
        parseUnits("1", oldDecimals);
}

export const calculateQuoteAndBaseAmounts = (amount: bigint, type: TokenTypes, IforCalc: bigint, baseDecimals: number, quoteDecimals: number) => {
    const isBaseDecimalsGreater = baseDecimals > quoteDecimals;

    const tokenDecimalsDifference = Math.abs(baseDecimals - quoteDecimals);
    const tokensDecimalsDifferencePrecision = parseUnits(
        "1",
        tokenDecimalsDifference
    );

    let baseInAmount = 0n;
    let quoteInAmount = 0n;


    const baseAdjustedRatePrecision = isBaseDecimalsGreater
        ? RATE_PRECISION * tokensDecimalsDifferencePrecision
        : RATE_PRECISION / tokensDecimalsDifferencePrecision;

    if (type == TokenTypes.Base) {
        baseInAmount = amount;
        quoteInAmount =
            (amount * IforCalc) / baseAdjustedRatePrecision;
    } else {
        quoteInAmount = amount;
        baseInAmount = amount
            ? (amount * baseAdjustedRatePrecision) / IforCalc
            : 0n;
    }

    return { baseInAmount, quoteInAmount };
}