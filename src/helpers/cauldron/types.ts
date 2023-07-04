import type { BigNumber } from "ethers";

export type UserBorrowInfo = {
  userBorrowPart: BigNumber;
  userBorrowAmount: BigNumber;
};

export type UserCollateralInfo = {
  userCollateralShare: BigNumber;
  userCollateralAmount: BigNumber;
};

export type UserPositions = {
  collateralInfo: UserCollateralInfo;
  borrowInfo: UserBorrowInfo;
  oracleRate: BigNumber;
  liquidationPrice: String;
};

export type MainParams = {
  borrowFee: number;
  interest: number;
  liquidationFee: number;
  collateralPrice: BigNumber;
  mimLeftToBorrow: BigNumber;
  maximumCollateralRatio: BigNumber;
  oracleExchangeRate: BigNumber;
  totalBorrowed: BigNumber;
  tvl: BigNumber;
  userMaxBorrow: BigNumber;
};

export type UserTokensInfo = {
  collateralBalance: BigNumber;
  mimBalance: BigNumber;
  nativeTokenBalance: BigNumber;
  collateralAllowance: BigNumber;
  mimAllowance: BigNumber;
  unwrappedTokenBalance: BigNumber | null;
  unwrappedTokenAllowance: BigNumber | null;
};

export type CauldronInfo = {
  config: Object | undefined;
  contracts: Object | null;
  mainParams: MainParams;
  userPosition: UserPositions;
  userTokensInfo: UserTokensInfo | null;
};

export type CauldronPositionItem = {
  config: object;
  oracleRate: BigNumber;
  collateralInfo: UserCollateralInfo;
  borrowInfo: UserBorrowInfo;
  liquidationPrice: number;
};
