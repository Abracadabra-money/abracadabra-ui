import type { BigNumber } from "ethers";
import type { Address } from "viem";

export type CookData = {
  events: Array<number>;
  values: Array<string | number>;
  datas: Array<string>;
};

export type PayloadAddCollateral = {
  amount: BigNumber;
  useNativeToken: boolean;
  useWrapper: boolean;
  to: Address;
};

export type PayloadAddCollateralAndBorrow = {
  collateralAmount: BigNumber;
  mimAmount: BigNumber;
  useNativeToken: boolean;
  useWrapper: boolean;
  to: Address;
};

export type PayloadBorrow = {
  amount: BigNumber;
  to: Address;
};

export type PayloadDeleverage = {
  repayAmount: BigNumber;
  collateralShare: BigNumber;
  removeCollateralShare: BigNumber;
  itsMax: boolean;
  slipage: number;
  to: Address;
  withdrawUnwrapToken: boolean;
};

export type PayloadLeverage = {
  collateralAmount: BigNumber;
  mimAmount: BigNumber;
  shareToMin: BigNumber;
  useNativeToken: boolean;
  slipage: number;
  useWrapper: boolean;
  to: Address;
};

export type PayloadRemoveCollateral = {
  collateralShare: BigNumber;
  to: Address;
  withdrawUnwrapToken: boolean;
};

export type PayloadRemoveCollateralAndRepay = {
  collateralShare: BigNumber;
  mimPart: BigNumber;
  itsMax: boolean;
  to: Address;
  withdrawUnwrapToken: boolean;
};

export type PayloadRepay = {
  amount: BigNumber;
  itsMax: boolean;
  to: Address;
};

export type PayloadDeleverageFromOrderGm = {
  repayAmount: BigNumber;
  removeCollateralShare: BigNumber;
  itsMax: boolean;
  slipage: number;
  to: Address;
  order: Address
}

export type PayloadLeverageGm = {
  collateralAmount: BigNumber;
  mimAmount: BigNumber;
  slipage: number;
  useWrapper: boolean;
  to: Address;
} 

export type PayloadRecoverFailedLeverageGm = {
  order: Address,
  to: Address
}

export type PayloadWithdrawToOrderGm = {
  collateralShare: BigNumber;
}