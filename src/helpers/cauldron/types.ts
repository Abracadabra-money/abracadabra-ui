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
  liquidationPrice: String | number;
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
  additionalInfo: AdditionalInfo;
};

export type CauldronPositionItem = {
  config: object;
  oracleRate: BigNumber;
  collateralInfo: UserCollateralInfo;
  borrowInfo: UserBorrowInfo;
  liquidationPrice: number;
};

export type AdditionalInfo = {
  isMasterContractApproved: Boolean;
  tokensRate: BigNumber;
  maxWithdrawAmount: BigNumber;
  whitelistedInfo: Object | null;
  isCollateralLocked: any;
  feePercent: number | null;
};

export type SwapAmounts = {
  amountFrom: BigNumber,
  amountToMin: BigNumber
}

export type DepositAmounts = {
  inputAmount: BigNumber,
  collateralTokenAmount: BigNumber,
  unwrapTokenAmount: BigNumber,
}

export type ActionAmounts = {
  depositAmounts: DepositAmounts,
  borrowAmount: BigNumber,
  repayAmount: BigNumber,
  withdrawAmount: BigNumber,
  leverageAmounts: SwapAmounts,
  deleverageAmounts: SwapAmounts
}

export type ActionConfig = {
  useLeverage: boolean,
  useDeleverage: boolean,
  useNativeToken: boolean,
  useUnwrapToken: boolean,
  amounts: ActionAmounts
}
