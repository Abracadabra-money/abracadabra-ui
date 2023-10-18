import { ONE_ETHER_VIEM } from "@/constants/global";

export const userPositionEmptyState = {
  collateralInfo: {
    userCollateralShare: 0n,
    userCollateralAmount: 0n,
  },
  borrowInfo: {
    userBorrowAmount: 0n,
    userBorrowPart: 0n,
  },
  oracleRate: 0n,
  liquidationPrice: "0",
};

export const userTokensInfoEmptyState = {
  collateralBalance: 0n,
  mimBalance: 0n,
  nativeTokenBalance: 0n,
  collateralAllowance: 0n,
  mimAllowance: 0n,
  unwrappedTokenBalance: 0n,
  unwrappedTokenAllowance: 0n,
};

export const additionalInfoEmptyState = {
  isMasterContractApproved: false,
  tokensRate: ONE_ETHER_VIEM,
  maxWithdrawAmount: 0n,
  whitelistedInfo: { isUserWhitelisted: false },
  isCollateralLocked: false,
  feePercent: null,
};
