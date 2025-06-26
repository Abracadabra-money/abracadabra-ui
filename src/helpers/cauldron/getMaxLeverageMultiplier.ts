import {
  getLeverageAmounts,
  getLiquidationPrice,
  PERCENT_PRESITION,
} from "@/helpers/cauldron/utils";
import { BigNumber, utils } from "ethers";
import type { CauldronInfo } from "@/helpers/cauldron/types";
import { expandDecimals } from "@/helpers/gm/fee/expandDecials";

const MIM_DECIMALS = 18;

export const getMaxLeverageMultiplier = (
  { mainParams, config, userPosition }: any,
  ignoreUserPosition = true,
  depositAmount: BigNumber = BigNumber.from(0),
  slippage: BigNumber = expandDecimals(1, 2)
) => {
  const { mcr } = config;
  const { oracleExchangeRate } = mainParams;
  const { decimals } = config.collateralInfo;
  let userBorrowAmount = BigNumber.from(
    userPosition.borrowInfo.userBorrowAmount
  );
  const { userCollateralAmount } = userPosition.collateralInfo;
  let positionExpectedCollateral =
    BigNumber.from(userCollateralAmount).add(depositAmount);

  if (ignoreUserPosition) {
    positionExpectedCollateral = utils.parseUnits("10", decimals);
    userBorrowAmount = BigNumber.from(0);
  }

  // if user position is empty
  const testCollateral = positionExpectedCollateral.gt(0)
    ? positionExpectedCollateral
    : utils.parseUnits("10", decimals);

  const collateralPrice = expandDecimals(1, 18 + decimals).div(
    BigNumber.from(oracleExchangeRate)
  );

  let multiplier = 2;
  let isLiquidation = false;

  while (!isLiquidation) {
    const multiplierParsed = utils.parseUnits(
      parseFloat(String(multiplier)).toFixed(2),
      PERCENT_PRESITION
    );

    const leverageAmounts = getLeverageAmounts(
      //@ts-ignore
      testCollateral,
      multiplierParsed,
      //@ts-ignore
      slippage,
      BigNumber.from(oracleExchangeRate)
    );

    const finalCollateralAmount = testCollateral.add(
      leverageAmounts.amountToMin
    );

    const finalBorrowPart = userBorrowAmount.add(leverageAmounts.amountFrom);

    const liquidationPrice = getLiquidationPrice(
      finalBorrowPart,
      finalCollateralAmount,
      mcr - 1, // liquidation protection
      decimals
    );

    if (liquidationPrice.gt(collateralPrice)) {
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
  const positionExpectedCollateral = BigNumber.from(userCollateralAmount).add(
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
