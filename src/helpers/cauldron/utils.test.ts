import {
  PERCENT_PRESITION,
  applyBorrowFee,
  applyTokenWrapperRate,
  getDeleverageAmounts,
  getLeverageAmounts,
  getLiquidationPrice,
  getMaxCollateralToRemove,
  getMaxToBorrow,
  getMimToBorrowByLtv,
  getPositionHealth,
  getUserLtv,
} from "@/helpers/cauldron/utils";
import { BigNumber, utils } from "ethers";
import { describe, expect, it } from "vitest";
import type { SwapAmounts } from "@/helpers/cauldron/types";
import { expandDecimals } from "@/helpers/gm/fee/expandDecials";
import { applySlippageToMinOut } from "@/helpers/gm/applySlippageToMinOut";

const ZERO_VALUE = BigNumber.from(0);
const FENCING_AGAINST_LIQUIDATION = expandDecimals(1, PERCENT_PRESITION); // 1% of mcr

const mcr = 75;
const MIM_DECIMALS = 18;
const collateralDecimals = 18;
const COLATERIZATION_PRESITION = 5;
const oracleExchangeRate = utils.parseUnits("2", collateralDecimals);

describe("getLiquidationPrice", () => {
  it("should return 0 if borrowAmount is 0", () => {
    const borrowAmount = ZERO_VALUE;
    const collateralAmount = BigNumber.from(200);
    const mcr = 75;

    expect(
      getLiquidationPrice(
        borrowAmount,
        collateralAmount,
        mcr,
        collateralDecimals
      )
    ).toEqual(ZERO_VALUE);
  });

  it("should return 0 if collateralAmount is 0", () => {
    const borrowAmount = BigNumber.from(100);
    const collateralAmount = ZERO_VALUE;

    expect(
      getLiquidationPrice(
        borrowAmount,
        collateralAmount,
        mcr,
        collateralDecimals
      )
    ).toEqual(ZERO_VALUE);
  });

  it("should calculate the liquidation price correctly", () => {
    const borrowAmount = BigNumber.from(100);
    const collateralAmount = BigNumber.from(200);

    // Calculate the expected liquidation price manually
    const colaterizationRate = BigNumber.from(mcr)
      .mul(expandDecimals(1, COLATERIZATION_PRESITION))
      .div(100);

    const liquidationPrice = borrowAmount
      .mul(expandDecimals(1, collateralDecimals + COLATERIZATION_PRESITION))
      .div(collateralAmount)
      .div(colaterizationRate);

    expect(
      getLiquidationPrice(
        borrowAmount,
        collateralAmount,
        mcr,
        collateralDecimals
      )
    ).toEqual(liquidationPrice);
  });
});

describe("getMaxToBorrow", () => {
  const parseMcr = expandDecimals(mcr, PERCENT_PRESITION);

  it("should return 0 when userBorrowAmount is greater than maxToBorrow", () => {
    const collateralAmount = utils.parseUnits("100", collateralDecimals);
    const userBorrowAmount = utils.parseUnits("200", collateralDecimals);

    const result = getMaxToBorrow(
      collateralAmount,
      userBorrowAmount,
      parseMcr,
      oracleExchangeRate
    );

    expect(result).toEqual(ZERO_VALUE);
  });

  it("should return maxToBorrow - userBorrowAmount when userBorrowAmount is less than maxToBorrow", () => {
    const collateralAmount = utils.parseUnits("100", collateralDecimals);
    const userBorrowAmount = utils.parseUnits("7", collateralDecimals);

    const result = getMaxToBorrow(
      collateralAmount,
      userBorrowAmount,
      parseMcr,
      oracleExchangeRate
    );

    expect(result).toEqual(utils.parseUnits("30"));
  });

  it("should return maxToBorrow - userBorrowAmount when userBorrowAmount is equal to maxToBorrow", () => {
    const collateralAmount = utils.parseUnits("100", collateralDecimals);
    const userBorrowAmount = utils.parseUnits("37", collateralDecimals);

    const result = getMaxToBorrow(
      collateralAmount,
      userBorrowAmount,
      parseMcr,
      oracleExchangeRate
    );

    expect(result).toEqual(ZERO_VALUE);
  });
});

describe("getUserLtv", () => {
  it("should return 0 if collateral amount is zero", () => {
    const collateralAmount = utils.parseUnits("0", collateralDecimals);
    const userBorrowAmount = utils.parseUnits("100", collateralDecimals);

    const result = getUserLtv(
      collateralAmount,
      userBorrowAmount,
      oracleExchangeRate
    );

    expect(result).toEqual(ZERO_VALUE);
  });

  it("should calculate the correct LTV", () => {
    const collateralAmount = utils.parseUnits("100", collateralDecimals);
    const userBorrowAmount = utils.parseUnits("5", collateralDecimals);

    const result = getUserLtv(
      collateralAmount,
      userBorrowAmount,
      oracleExchangeRate
    );

    expect(result).toEqual(utils.parseUnits("10", PERCENT_PRESITION));
  });

  it("should return 0 if collateral amount is zero and user borrow amount is zero", () => {
    const collateralAmount = ZERO_VALUE;
    const userBorrowAmount = ZERO_VALUE;

    const result = getUserLtv(
      collateralAmount,
      userBorrowAmount,
      oracleExchangeRate
    );

    expect(result).toEqual(ZERO_VALUE);
  });

  it("should calculate the correct LTV when collateral amount is greater than user borrow amount", () => {
    const collateralAmount = utils.parseUnits("100", collateralDecimals);
    const userBorrowAmount = utils.parseUnits("50", collateralDecimals);

    const result = getUserLtv(
      collateralAmount,
      userBorrowAmount,
      oracleExchangeRate
    );

    console.log();

    expect(result).toEqual(utils.parseUnits("100", PERCENT_PRESITION));
  });

  it("should calculate the correct LTV when collateral amount is less than user borrow amount", () => {
    const collateralAmount = utils.parseUnits("50", collateralDecimals);
    const userBorrowAmount = utils.parseUnits("100", collateralDecimals);

    const result = getUserLtv(
      collateralAmount,
      userBorrowAmount,
      oracleExchangeRate
    );

    expect(result).toEqual(utils.parseUnits("400", PERCENT_PRESITION));
  });
});

describe("getMimToBorrowByLtv", () => {
  it("should return 0 if ltv is greater than mcr", () => {
    const ltv = expandDecimals(80, PERCENT_PRESITION);
    const mcr = expandDecimals(70, PERCENT_PRESITION);
    const collateralAmount = utils.parseUnits("1000", collateralDecimals);
    const userBorrowAmount = utils.parseUnits("500", collateralDecimals);

    const result = getMimToBorrowByLtv(
      ltv,
      mcr,
      collateralAmount,
      userBorrowAmount,
      oracleExchangeRate
    );

    expect(result).toEqual(ZERO_VALUE);
  });

  it("should return 0 if ltv is less than or equal to currentLtv", () => {
    const ltv = expandDecimals(60, PERCENT_PRESITION);
    const mcr = expandDecimals(70, PERCENT_PRESITION);
    const collateralAmount = utils.parseUnits("1000", collateralDecimals);
    const userBorrowAmount = utils.parseUnits("500", collateralDecimals);

    const result = getMimToBorrowByLtv(
      ltv,
      mcr,
      collateralAmount,
      userBorrowAmount,
      oracleExchangeRate
    );

    expect(result).toEqual(ZERO_VALUE);
  });

  it("should calculate the mimToBorrow correctly", () => {
    const ltv = expandDecimals(60, PERCENT_PRESITION);
    const mcr = expandDecimals(70, PERCENT_PRESITION);
    const collateralAmount = utils.parseUnits("1000", collateralDecimals);
    const userBorrowAmount = utils.parseUnits("100", collateralDecimals);

    const result = getMimToBorrowByLtv(
      ltv,
      mcr,
      collateralAmount,
      userBorrowAmount,
      oracleExchangeRate
    );

    const expectedMimToBorrow = utils.parseUnits("200", collateralDecimals);
    expect(result).toEqual(expectedMimToBorrow);
  });

  it("should return leftToBorrow if mimToBorrow is greater than leftToBorrow", () => {
    const ltv = BigNumber.from(80);
    const mcr = BigNumber.from(70);
    const collateralAmount = BigNumber.from(1000);
    const userBorrowAmount = BigNumber.from(500);

    const result = getMimToBorrowByLtv(
      ltv,
      mcr,
      collateralAmount,
      userBorrowAmount,
      oracleExchangeRate
    );

    const leftToBorrow = getMaxToBorrow(
      collateralAmount,
      userBorrowAmount,
      mcr,
      oracleExchangeRate
    );

    expect(result).toEqual(leftToBorrow);
  });
});

describe("getMaxCollateralToRemove", () => {
  it("should return the collateralAmount when userBorrowAmount is 0", () => {
    const collateralAmount = BigNumber.from(100);
    const userBorrowAmount = ZERO_VALUE;
    const mcr = BigNumber.from(50);
    const oracleExchangeRate = BigNumber.from(2);

    const result = getMaxCollateralToRemove(
      collateralAmount,
      userBorrowAmount,
      mcr,
      oracleExchangeRate
    );

    expect(result).toEqual(collateralAmount);
  });

  it("should return the correct value when userBorrowAmount is not 0", () => {
    const collateralAmount = BigNumber.from(100);
    const userBorrowAmount = BigNumber.from(50);
    const mcr = BigNumber.from(50);
    const oracleExchangeRate = BigNumber.from(2);

    const result = getMaxCollateralToRemove(
      collateralAmount,
      userBorrowAmount,
      mcr,
      oracleExchangeRate
    );

    const currentLtv = getUserLtv(
      collateralAmount,
      userBorrowAmount,
      oracleExchangeRate
    );
    const minCollateralAmount = currentLtv
      .mul(collateralAmount)
      .div(mcr.sub(FENCING_AGAINST_LIQUIDATION));
    const maxToRemoveLeft = collateralAmount.sub(minCollateralAmount);
    const maxToRemove = maxToRemoveLeft.lt(0) ? ZERO_VALUE : maxToRemoveLeft;
    const expected = maxToRemove.gt(collateralAmount)
      ? collateralAmount
      : maxToRemove;

    expect(result).toEqual(expected);
  });

  it("should return 0 when collateralAmount is 0", () => {
    const collateralAmount = ZERO_VALUE;
    const userBorrowAmount = BigNumber.from(50);
    const mcr = BigNumber.from(50);
    const oracleExchangeRate = BigNumber.from(2);

    const result = getMaxCollateralToRemove(
      collateralAmount,
      userBorrowAmount,
      mcr,
      oracleExchangeRate
    );

    expect(result).toEqual(ZERO_VALUE);
  });

  it("should return 0 when userBorrowAmount is greater than collateralAmount", () => {
    const collateralAmount = utils.parseUnits("100", collateralDecimals);
    const userBorrowAmount = utils.parseUnits("150", collateralDecimals);
    const mcr = expandDecimals(70, PERCENT_PRESITION);

    const result = getMaxCollateralToRemove(
      collateralAmount,
      userBorrowAmount,
      mcr,
      oracleExchangeRate
    );

    expect(result).toEqual(ZERO_VALUE);
  });

  it("should return the correct value when maxToRemoveLeft is negative", () => {
    const collateralAmount = BigNumber.from(100);
    const userBorrowAmount = BigNumber.from(50);
    const mcr = BigNumber.from(200);
    const oracleExchangeRate = BigNumber.from(2);

    const result = getMaxCollateralToRemove(
      collateralAmount,
      userBorrowAmount,
      mcr,
      oracleExchangeRate
    );

    const currentLtv = getUserLtv(
      collateralAmount,
      userBorrowAmount,
      oracleExchangeRate
    );
    const minCollateralAmount = currentLtv
      .mul(collateralAmount)
      .div(mcr.sub(FENCING_AGAINST_LIQUIDATION));
    const maxToRemoveLeft = collateralAmount.sub(minCollateralAmount);
    const maxToRemove = maxToRemoveLeft.lt(0) ? ZERO_VALUE : maxToRemoveLeft;
    const expected = maxToRemove.gt(collateralAmount)
      ? collateralAmount
      : maxToRemove;

    expect(result).toEqual(expected);
  });
});

describe("getPositionHealth", () => {
  it("should calculate position health correctly", () => {
    const liquidationPrice = utils.parseUnits("0.5", collateralDecimals);
    const oracleExchangeRate = utils.parseUnits("0.7", collateralDecimals);

    const result = getPositionHealth(
      liquidationPrice,
      oracleExchangeRate,
      collateralDecimals
    );

    expect(result).toEqual({
      percent: utils.parseUnits("35", PERCENT_PRESITION),
      status: "safe",
    });
  });

  it("should calculate position health correctly when liquidation price is zero", () => {
    const liquidationPrice = ZERO_VALUE;
    const oracleExchangeRate = BigNumber.from(10);

    const result = getPositionHealth(
      liquidationPrice,
      oracleExchangeRate,
      collateralDecimals
    );

    expect(result).toEqual({ percent: ZERO_VALUE, status: "safe" });
  });

  it("should calculate position health correctly when collateral price is zero", () => {
    const liquidationPrice = utils.parseUnits("0.5", collateralDecimals);
    const oracleExchangeRate = ZERO_VALUE;

    const result = getPositionHealth(
      liquidationPrice,
      oracleExchangeRate,
      collateralDecimals
    );

    expect(result).toEqual({ percent: ZERO_VALUE, status: "safe" });
  });
});

describe("getLeverageAmounts", () => {
  it("should return correct amounts when collateralAmount is 0", () => {
    const collateralAmount = ZERO_VALUE;
    const leverageMultiplyer = BigNumber.from(1e2);
    const slippage = BigNumber.from(1e2);
    const oracleExchangeRate = BigNumber.from(100);

    const result = getLeverageAmounts(
      collateralAmount,
      leverageMultiplyer,
      slippage,
      oracleExchangeRate
    );

    expect(result.amountFrom).toEqual(ZERO_VALUE);
    expect(result.amountToMin).toEqual(ZERO_VALUE);
  });

  it("should return correct amounts when collateralAmount is not 0", () => {
    const collateralAmount = BigNumber.from(100);
    const leverageMultiplyer = BigNumber.from(1e2);
    const slippage = BigNumber.from(1e2);
    const oracleExchangeRate = BigNumber.from(100);

    const result = getLeverageAmounts(
      collateralAmount,
      leverageMultiplyer,
      slippage,
      oracleExchangeRate
    );

    const collateralToSwap = collateralAmount
      .mul(leverageMultiplyer)
      .div(expandDecimals(1, 2))
      .sub(collateralAmount);

    const amountFrom = expandDecimals(collateralToSwap, MIM_DECIMALS).div(
      oracleExchangeRate
    );

    const amountToMin = applySlippageToMinOut(
      Number(slippage),
      collateralToSwap
    );

    expect(result.amountFrom).toEqual(amountFrom);
    expect(result.amountToMin).toEqual(amountToMin);
  });
});

describe("getDeleverageAmounts", () => {
  it("should return the correct swap amounts", () => {
    const slippage1 = expandDecimals(1, PERCENT_PRESITION);
    const mimToRepayAmount1 = utils.parseUnits("100", collateralDecimals);
    const oracleExchangeRate1 = utils.parseUnits("0.7", collateralDecimals);

    const expectedSwapAmounts1: SwapAmounts = {
      amountFrom: utils.parseUnits("70.7", collateralDecimals),
      amountToMin: utils.parseUnits("100", collateralDecimals),
    };

    expect(
      getDeleverageAmounts(mimToRepayAmount1, slippage1, oracleExchangeRate1)
    ).toEqual(expectedSwapAmounts1);

    // Test case 2
    const mimToRepayAmount2 = ZERO_VALUE;
    const slippage2 = expandDecimals(1, PERCENT_PRESITION);
    const oracleExchangeRate2 = utils.parseUnits("0.7", collateralDecimals);

    const expectedSwapAmounts2: SwapAmounts = {
      amountFrom: ZERO_VALUE,
      amountToMin: ZERO_VALUE,
    };

    expect(
      getDeleverageAmounts(mimToRepayAmount2, slippage2, oracleExchangeRate2)
    ).toEqual(expectedSwapAmounts2);

    // Test case 3
    const mimToRepayAmount3 = utils.parseUnits("50", collateralDecimals);
    const slippage3 = expandDecimals(1, PERCENT_PRESITION);
    const oracleExchangeRate3 = utils.parseUnits("0.7", collateralDecimals);

    const expectedSwapAmounts3: SwapAmounts = {
      amountFrom: utils.parseUnits("35.35", collateralDecimals),
      amountToMin: utils.parseUnits("50", collateralDecimals),
    };

    expect(
      getDeleverageAmounts(mimToRepayAmount3, slippage3, oracleExchangeRate3)
    ).toEqual(expectedSwapAmounts3);

    // Test case 4
    const mimToRepayAmount4 = utils.parseUnits("200", collateralDecimals);
    const slippage4 = expandDecimals(1, PERCENT_PRESITION);
    const oracleExchangeRate4 = utils.parseUnits("0.7", collateralDecimals);
    const expectedSwapAmounts4: SwapAmounts = {
      amountFrom: utils.parseUnits("141.4", collateralDecimals),
      amountToMin: utils.parseUnits("200", collateralDecimals),
    };

    expect(
      getDeleverageAmounts(mimToRepayAmount4, slippage4, oracleExchangeRate4)
    ).toEqual(expectedSwapAmounts4);
  });
});

describe("applyBorrowFee", () => {
  it("should return 0 if borrowAmount is zero", () => {
    const borrowAmount = ZERO_VALUE;
    const borrowOpeningFee = 1000;

    const result = applyBorrowFee(borrowAmount, borrowOpeningFee);

    expect(result).toEqual(ZERO_VALUE);
  });

  it("should calculate the correct fee for non-zero borrowAmount", () => {
    const borrowAmount = BigNumber.from(1000000);
    const borrowOpeningFee = 1000;

    const result = applyBorrowFee(borrowAmount, borrowOpeningFee);

    // Calculate the expected fee
    const expectedFee = borrowAmount
      .mul(borrowOpeningFee)
      .div(expandDecimals(1, COLATERIZATION_PRESITION));

    // Calculate the expected result
    const expectedResult = borrowAmount.add(expectedFee);

    expect(result).toEqual(expectedResult);
  });
});

describe("applyTokenWrapperRate", () => {
  it("should return the correct result", () => {
    const unwrappedTokenAmount = BigNumber.from(100);
    const tokensRate = BigNumber.from(2);
    const unwrappedTokenDecimals = 18;

    const result = applyTokenWrapperRate(
      unwrappedTokenAmount,
      tokensRate,
      unwrappedTokenDecimals
    );

    expect(result).toEqual(utils.parseUnits("50"));
  });
});
