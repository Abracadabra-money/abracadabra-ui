import type { BigNumber } from "ethers";
import type { CauldronConfig } from "@/configs/cauldrons/configTypes";

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
  liquidationPrice: string | number;
  positionHealth: PositionHealth;
  alternativeData: {
    collateralInfo: {
      userCollateralShare: bigint;
      userCollateralAmount: bigint;
    };
    borrowInfo: {
      userBorrowPart: bigint;
      userBorrowAmount: bigint;
    };
    oracleRate: bigint;
    liquidationPrice: bigint;
    positionHealth: AlternativePositionHealth;
  };
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
  updatePrice: boolean;
  alternativeData: {
    collateralPrice: bigint;
    mimLeftToBorrow: bigint;
    maximumCollateralRatio: bigint;
    oracleExchangeRate: bigint;
    totalBorrowed: bigint;
    tvl: bigint;
    userMaxBorrow: bigint;
  };
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


// TODO: Add Contracts type
export type CauldronInfo = {
  config: CauldronConfig;
  contracts: Object | null;
  mainParams: MainParams;
  userPosition: UserPositions;
  userTokensInfo: UserTokensInfo | null;
  additionalInfo: AdditionalInfo;
};

export type CauldronPositionItem = {
  config: CauldronConfig;
  oracleRate: BigNumber;
  collateralInfo: UserCollateralInfo;
  borrowInfo: UserBorrowInfo;
  liquidationPrice: number | string;
};

export type AdditionalInfo = {
  isMasterContractApproved: Boolean;
  tokensRate: BigNumber;
  maxWithdrawAmount: BigNumber;
  whitelistedInfo: Object | null;
  isCollateralLocked: any;
  feePercent: number | null;
  gmInfo: any;
  hasActiveGmOrder: boolean;
};

export type SwapAmounts = {
  amountFrom: BigNumber;
  amountToMin: BigNumber;
};

export type DepositAmounts = {
  inputAmount: BigNumber;
  collateralTokenAmount: BigNumber;
  unwrapTokenAmount: BigNumber;
};

export type ActionAmounts = {
  depositAmounts: DepositAmounts;
  borrowAmount: BigNumber;
  repayAmount: BigNumber;
  withdrawAmount: BigNumber;
  leverageAmounts: SwapAmounts;
  deleverageAmounts: SwapAmounts;
  slippage: BigNumber;
};

export type ActionConfig = {
  useLeverage: boolean;
  useDeleverage: boolean;
  useNativeToken: boolean;
  useUnwrapToken: boolean;
  withdrawUnwrapToken: boolean;
  amounts: ActionAmounts;
};

export type UserTotalAssets = {
  collateralDepositedInUsd: number;
  mimBorrowed: number;
};

export type PositionHealth = { percent: number; status: PositionHealthStatus };
export type AlternativePositionHealth = { percent: bigint; status: PositionHealthStatus };

export type PositionHealthStatus = "safe" | "medium" | "high";
