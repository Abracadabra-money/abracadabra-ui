import type { ContractInfo } from "../global";

export type CrvStakeInfo = {
  tokensRate: bigint;
  mainToken: CrvTokenInfo;
  stakeToken: CrvTokenInfo;
};

type CrvTokenInfo = {
  name: string;
  icon: string;
  decimals: number;
  contract: ContractInfo;
  balance: bigint;
  approvedAmount?: bigint;
};
