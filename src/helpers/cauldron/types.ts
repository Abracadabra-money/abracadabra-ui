import type { BigNumber, Contract } from "ethers";
import type { UserBorrowInfo } from "./position/getUserBorrowInfo";
import type { UserCollateralInfo } from "./position/getUserCollateralInfo";

export type UserPositions = {
  oracleRate: BigNumber;
  collateralInfo: UserCollateralInfo;
  borrowInfo: UserBorrowInfo;
  liquidationPrice: number;
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
