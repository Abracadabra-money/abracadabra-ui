import type { BigNumber } from "ethers";

export type MagicGlpApy = {
  glpApy: number;
  magicGlpApy: number;
};

export type Prices = {
  gmxPrice: BigNumber;
  nativeTokenPrice: BigNumber;
};

export type AdditionalInfo = {
  aum: BigNumber;
  glpSupply: BigNumber;
  fees: Object;
};
