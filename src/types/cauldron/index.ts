import type { CauldronConfig } from "@/utils/cauldronsConfig/configTypes";

export type MainParams = {
  borrowFee: number;
  interest: number;
  liquidationFee: number;
  collateralPrice: bigint;
  mimLeftToBorrow: bigint;
  maximumCollateralRatio: bigint;
  oracleExchangeRate: bigint;
  totalBorrowed: bigint;
  tvl: bigint;
  userMaxBorrow: bigint;
  updatePrice: boolean;
};

export type UserPositions = {
  collateralInfo: {
    userCollateralShare: bigint;
    userCollateralAmount: bigint;
  };
  borrowInfo: {
    userBorrowPart: bigint;
    userBorrowAmount: bigint;
  };
  oracleRate: bigint;
  liquidationPrice: String;
};

export type UserTokensInfo = {
  collateralBalance: bigint;
  mimBalance: bigint;
  nativeTokenBalance: bigint;
  collateralAllowance: bigint;
  mimAllowance: bigint;
  unwrappedTokenBalance: bigint;
  unwrappedTokenAllowance: bigint;
};

export type AdditionalInfo = {
  isMasterContractApproved: boolean;
  tokensRate: bigint;
  maxWithdrawAmount: bigint;
  whitelistedInfo: Object | null;
  isCollateralLocked: any;
  feePercent: bigint | unknown;
};

export type CauldronInfo = {
  config: CauldronConfig;
  mainParams: MainParams;
  userPosition: UserPositions;
  userTokensInfo: UserTokensInfo;
  additionalInfo: AdditionalInfo;
};
