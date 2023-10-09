import type { ContractInfo } from "@/types/global";

export type MagicLvlTokensInfo = {
  name: string;
  tokensRate: bigint;
  feePercent: number;
  levelMasterContract: ContractInfo;
  mainToken: MagicLvlMainTokenInfo;
  stakeToken: MagicLvlStakeTokenInfo;
};

export type MagicLvlMainTokenInfo = {
  name: string;
  icon: string;
  decimals: number;
  contract: ContractInfo;
  balance: bigint;
  totalSupplyUsd: bigint;
  approvedAmount: bigint;
};

export type MagicLvlStakeTokenInfo = {
  name: string;
  icon: string;
  decimals: number;
  contract: ContractInfo;
  walletBalance: bigint;
  balance: bigint;
  pid: number;
};

export type MagicLvlTranchesInfo = {
  junior?: MagicLvlTrancheInfo;
  mezzanine?: MagicLvlTrancheInfo;
  senior?: MagicLvlTrancheInfo;
};

export type MagicLvlTrancheInfo = {
  feePercent: number;
  levelMasterContract: ContractInfo;
  mainToken: MagicLvlMainTokenInfo;
  name: string;
  stakeToken: MagicLvlStakeTokenInfo;
  tokensRate: bigint;
};

export type MagicLvlStakeInfo = {
  junior?: MagicLvlTrancheInfo;
  mezzanine?: MagicLvlTrancheInfo;
  senior?: MagicLvlTrancheInfo;
  seniorApy?: number;
  mezzanineApy?: number;
  juniorApy?: number;
  seniorTotalRewardsUsd?: number;
  mezzanineTotalRewardsUsd?: number;
  juniorTotalRewardsUsd?: number;
  totalRewardsUsd?: number;
  totalSupplyUsd?: bigint;
};

export type MagicLvlAdditionalInfo = {
  tranchesStatistics: {
    seniorApy?: number;
    mezzanineApy?: number;
    juniorApy?: number;
    seniorTotalRewardsUsd?: number;
    mezzanineTotalRewardsUsd?: number;
    juniorTotalRewardsUsd?: number;
    totalRewardsUsd?: number;
    totalSupplyUsd?: bigint;
  };
};
