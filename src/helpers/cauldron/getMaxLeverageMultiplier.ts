import { utils } from "ethers";

export const getMaxLeverageMultiplier = (
  { mainParams, config, userPosition, additionalInfo }: any,
  collateralAmount = 10,
  useOtherToken = false
) => {
  const { mcr } = config;
  const { tokensRate } = additionalInfo;
  const { oracleExchangeRate } = mainParams;
  const { decimals } = config.collateralInfo;
  const { userBorrowAmount } = userPosition.borrowInfo;
  const { userCollateralAmount } = userPosition.collateralInfo;

  const exchangeRate = +utils.formatUnits(oracleExchangeRate, decimals);
  const borrowAmount = +utils.formatUnits(userBorrowAmount);
  const depositAmount = +utils.formatUnits(userCollateralAmount, decimals);
  const rate = +utils.formatUnits(tokensRate, decimals);

  const instantLiquidationPrice = 1 / exchangeRate;
  const liquidationMultiplier = mcr / 100;
  const testCollateralAmount = useOtherToken
    ? collateralAmount / rate
    : collateralAmount;

  const testSlippage = 1;
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
