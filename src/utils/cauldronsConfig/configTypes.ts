type CauldronSettings = {
  isSwappersActive: boolean;
  is0xSwap?: boolean;
  isDegenBox: boolean;
  strategyLink: boolean | string;
  isDepreciated: boolean;
  acceptUseDefaultBalance: boolean;
  healthMultiplier: number;
  hasAccountBorrowLimit: boolean;
  hasWithdrawableLimit: boolean;
  localBorrowAmountLimit: boolean;
  hasCrvClaimLogic: boolean;
  isNew?: boolean;
  executionPrice?: boolean;
  isMigrated?: boolean;
  oracleAddress?: string;
};

type MimInfo = {
  name: string;
  icon: string;
  decimals: number;
  address: string;
  abi: any;
};

export type CauldronConfig = {
  icon: string;
  name: string;
  chainId: number;
  id: number;
  liquidationFee: number;
  interest?: number;
  mcr: number;
  borrowFee: number;
  version: number;
  cauldronSettings: CauldronSettings;
  contract: {
    name: string;
    address: string;
    abi: any;
  };
  collateralInfo: {
    name: string;
    decimals: number;
    address: string;
    abi: any;
  };
  mimInfo: MimInfo;
  wrapInfo?: {
    isHiddenWrap: boolean;
    unwrappedToken: {
      name: string;
      icon: string;
      address: string;
      abi: any;
    };
    wrapper: {
      address: string;
      abi: any;
    };
  };
  leverageInfo?: {
    address: string;
    abi: any;
  };
  deleverageInfo?: {
    address: string;
    abi: any;
  };
};
