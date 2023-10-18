import type { Address } from "viem";

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
  isPrivate?: boolean;
  privatelyFor?: string[];
  isAlternativeInterest?: boolean;
  isMagicApe?: boolean;
  isSSpell?: boolean;
};

type MimInfo = {
  name: string;
  icon: string;
  decimals: number;
  address: Address;
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
    address: Address;
    abi: any;
  };
  collateralInfo: {
    name: string;
    decimals: number;
    address: Address;
    abi: any;
  };
  mimInfo: MimInfo;
  wrapInfo?: {
    isHiddenWrap: boolean;
    useUnwrappedByDefault: boolean;
    unwrappedToken: {
      name: string;
      icon: string;
      address: Address;
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
