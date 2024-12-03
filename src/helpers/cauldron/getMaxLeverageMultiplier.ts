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
  { mainParams, config, userPosition, additionalInfo }: any,
  collateralAmount = 10,
  useOtherToken = false,
  slippage = 1,
  ignoreUserPosition = false
) => {
  const { mcr } = config;
  const { tokensRate } = additionalInfo;
  const { oracleExchangeRate } = mainParams;
  const { decimals } = config.collateralInfo;
  const { userBorrowAmount } = userPosition.borrowInfo;
  const { userCollateralAmount } = userPosition.collateralInfo;

  const exchangeRate = +utils.formatUnits(oracleExchangeRate, decimals);
  const borrowAmount = !ignoreUserPosition
    ? +utils.formatUnits(userBorrowAmount)
    : 0;
  const depositAmount = !ignoreUserPosition
    ? +utils.formatUnits(userCollateralAmount, decimals)
    : 0;
  const rate = +utils.formatUnits(tokensRate, decimals);

  const instantLiquidationPrice = 1 / exchangeRate;
  const liquidationMultiplier = mcr / 100;
  const testCollateralAmount = useOtherToken
    ? collateralAmount / rate
    : collateralAmount;

  const testSlippage = slippage;
  let multiplier = 2;
  let isLiquidation = false;

  while (!isLiquidation) {
    const expectedAmount =
      testCollateralAmount * multiplier - testCollateralAmount;
    const slippageAmount = (expectedAmount / 100) * testSlippage;
    const minExpected = expectedAmount - slippageAmount;
    const leverageCollateralAmount = testCollateralAmount + minExpected;
    const leverageBorrowPart = expectedAmount / exchangeRate;

    const finalBorrowPart = leverageBorrowPart + borrowAmount;

    const finalCollateralAmount = +leverageCollateralAmount + depositAmount;

    const liquidationPrice =
      finalBorrowPart / finalCollateralAmount / liquidationMultiplier || 0;

    if (+liquidationPrice >= instantLiquidationPrice) {
      isLiquidation = true;
      break;
    }

    multiplier += 0.1;
  }

  const result = Math.min(multiplier, 100);

  return +parseFloat(result.toString()).toFixed(2);
};

export const getMaxLeverageMultiplierAlternative = (
  { mainParams, config, userPosition }: any,
  ignoreUserPosition = true,
  depositAmount: BigNumber = BigNumber.from(0),
  slippage: BigNumber = expandDecimals(1, 2),
) => {
  const { mcr } = config;
  const { oracleExchangeRate } = mainParams;
  const { decimals } = config.collateralInfo;
  let userBorrowAmount = userPosition.borrowInfo.userBorrowAmount;
  const { userCollateralAmount } = userPosition.collateralInfo;
  let positionExpectedCollateral = userCollateralAmount.add(depositAmount);

  if (ignoreUserPosition) {
    positionExpectedCollateral = utils.parseUnits("10", decimals);
    userBorrowAmount = BigNumber.from(0);
  }

  // if user position is empty
  const testCollateral = positionExpectedCollateral.gt(0)
    ? positionExpectedCollateral
    : utils.parseUnits("10", decimals);

  const collateralPrice = expandDecimals(1, 18 + decimals).div(
    oracleExchangeRate
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
      oracleExchangeRate
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
    .div(oracleExchangeRate);
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
