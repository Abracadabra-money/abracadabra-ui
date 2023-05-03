export const getLiquidationPrice = (
  userCollateralShare: string | number,
  userBorrowPart: string | number,
  mcr: number
): number => {
  if(Number(userCollateralShare) === 0) return 0;
  if(Number(userBorrowPart) === 0) return 0;

  const liquidationPrice =
    +userBorrowPart / +userCollateralShare / (mcr / 100) || 0;

  return liquidationPrice;
};
