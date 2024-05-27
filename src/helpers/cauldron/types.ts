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
  liquidationPrice: String | number;
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

export type ContractsInfo = {
  bentoBox: Contract;
  cauldron: Contract;
  collateral: Contract;
  leverageSwapper: Contract;
  liquidationSwapper: Contract;
  mim: Contract;
  unwrappedToken: Contract;
  wrapper: Contract;
};

export type CauldronInfo = {
  config: CauldronConfig;
  contracts: any;
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
