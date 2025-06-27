import { parseUnits } from "viem";
import { BigNumber, utils } from "ethers";
import { PERCENT_PRESITION } from "@/helpers/cauldron/utils";
import type { CauldronInfo } from "@/helpers/cauldron/types";
import { getLeverageAmounts } from "@/helpers/migrationHelpers/utils";
import { getLiquidationPrice } from "@/helpers/migrationHelpers/utils";

const MIM_DECIMALS = 18;

export const getMaxLeverageMultiplier = (
  oracleExchangeRate: bigint,
  mcr: number,
  collateralDecimals: number,
  userBorrowAmount: bigint,
  userCollateralAmount: bigint,
  ignoreUserPosition: boolean = true,
  depositAmount: bigint = 0n,
  slippage: bigint = 100n
) => {
  let borrowAmount = userBorrowAmount;
  let positionExpectedCollateral = userCollateralAmount + depositAmount;

  if (ignoreUserPosition) {
    positionExpectedCollateral = parseUnits("10", collateralDecimals);
    borrowAmount = 0n;
  }

  // if user position is empty
  const collateralAmount =
    positionExpectedCollateral > 0n
      ? positionExpectedCollateral
      : parseUnits("10", collateralDecimals);

  const collateralPrice =
    parseUnits("1", 18 + collateralDecimals) / oracleExchangeRate;

  let multiplier = 2;
  let isLiquidation = false;

  while (!isLiquidation) {
    const multiplierParsed = parseUnits(String(multiplier), PERCENT_PRESITION);

    const leverageAmounts = getLeverageAmounts(
      collateralAmount,
      multiplierParsed,
      slippage,
      oracleExchangeRate
    );

    const finalCollateralAmount =
      collateralAmount + leverageAmounts.amountToMin;

    const finalBorrowPart = borrowAmount + leverageAmounts.amountFrom;

    const liquidationPrice = getLiquidationPrice(
      finalBorrowPart,
      finalCollateralAmount,
      mcr - 1, // liquidation protection
      collateralDecimals
    );

    if (liquidationPrice > collateralPrice) {
      isLiquidation = true;
      multiplier -= 0.1;
      break;
    }

    multiplier += 0.1;
  }

  const result = Math.min(multiplier, 50);

  return +parseFloat(result.toString()).toFixed(2);
};

export const getBorrowAmountByMultiplier = (
  leverageMultiplier: number = 1,
  cauldron: CauldronInfo,
  depositCollateralAmount: BigNumber // Additional security amount
): BigNumber => {
  if (!cauldron) return BigNumber.from(0);

  const { oracleExchangeRate } = cauldron.mainParams;
  const { userCollateralAmount } = cauldron.userPosition.collateralInfo;

  // Expected new security amount (current + additional security amount)
  const positionExpectedCollateral = userCollateralAmount.add(
    depositCollateralAmount
  );

  // We convert the multiplier to accuracy (percentage accuracy for leverage)
  const multiplier = utils.parseUnits(
    String(leverageMultiplier),
    PERCENT_PRESITION
  );

  // We calculate the security required for the loan
  const collateralToSwap = positionExpectedCollateral
    .mul(multiplier) // multiply by the leverage factor
    .div(BigNumber.from(10).pow(2)) // Divide by 100 for proper scaling
    .sub(positionExpectedCollateral); // We subtract the initial provision

  // We return the borrowed amount, scaled according to the oracle and the correct format
  return collateralToSwap
    .mul(BigNumber.from(10).pow(MIM_DECIMALS))
    .div(BigNumber.from(oracleExchangeRate));
};

export const getLeverageMultiplierByBorrowAmount = (
  borrowInputValue: BigNumber,
  maxToBorrow: BigNumber,
  maxLeverageMultiplier: number
) => {
  if (borrowInputValue.isZero() || maxToBorrow.isZero()) {
    return utils.parseUnits("1", 18);
  }

  const maxMultiplier = utils.parseUnits(
    String((maxLeverageMultiplier - 1) * 100),
    18
  );

  const leveragePercentage = maxToBorrow
    .mul(BigNumber.from(10).pow(MIM_DECIMALS))
    .div(maxMultiplier);

  return borrowInputValue
    .mul(BigNumber.from(10).pow(MIM_DECIMALS))
    .div(leveragePercentage)
    .div(BigNumber.from(10).pow(PERCENT_PRESITION))
    .add(BigNumber.from(10).pow(MIM_DECIMALS));
};
