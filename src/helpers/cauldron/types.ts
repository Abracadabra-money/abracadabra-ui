import type { BigNumber, Contract } from "ethers";
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
  positionHealth: { percent: number; status: PositionHealthStatus };
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
    positionHealth: PositionHealth;
  };
};

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

export type UserTokensInfo = {
  collateralBalance: BigNumber;
  mimBalance: BigNumber;
  nativeTokenBalance: BigNumber;
  collateralAllowance: BigNumber;
  mimAllowance: BigNumber;
  unwrappedTokenBalance: BigNumber | null;
  unwrappedTokenAllowance: BigNumber | null;
};

export type CauldronContracts = {
  bentoBox: Contract;
  cauldron: Contract;
  collateral: Contract;
  mim: Contract;
  leverageSwapper: Contract | null;
  liquidationSwapper: Contract | null;
  unwrappedToken: Contract | null;
  wrapper: Contract | null;
};

export type CauldronInfo = {
  config: CauldronConfig;
  contracts: CauldronContracts;
  mainParams: MainParams;
  userPosition: UserPositions;
  userTokensInfo: UserTokensInfo;
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
  additionalInfo?: {
    maxBorrowAmountMultiplier: BigNumber;
  };
};

export type UserTotalAssets = {
  collateralDepositedInUsd: number;
  mimBorrowed: number;
};

export type PositionHealth = {
  percent: bigint;
  status: PositionHealthStatus;
};

export type PositionHealthStatus = "safe" | "medium" | "high";
