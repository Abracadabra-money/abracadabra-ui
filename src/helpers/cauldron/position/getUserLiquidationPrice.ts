export const getLiquidationPrice = (
  userCollateralShare: string | number,
  userBorrowPart: string | number,
  mcr: number
): number => {
  const liquidationPrice =
    +userBorrowPart / +userCollateralShare / (mcr / 100) || 0;

  return liquidationPrice;
};
