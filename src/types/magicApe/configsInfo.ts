import type { ContractInfo } from "@/types/global";
import type { RewardToken } from "@/types/magicApe/additionalInfo";
import type {
  MainTokenInfo,
  StakeTokenInfo,
} from "@/types/magicApe/tokensInfo";

export type MagicApeConfigs = {
  1: ChainConfig;
};

export type ChainConfig = {
  mainToken: {
    name: string;
    decimals: number;
    icon: string;
    rateIcon: string;
    contract: ContractInfo;
  };
  stakeToken: {
    name: string;
    decimals: number;
    icon: string;
    contract: ContractInfo;
  };
  oracle: ContractInfo;
  chainLink: ContractInfo;
  rewardToken: RewardToken;
};

export type StakeInfo = {
  mainToken: MainTokenInfo;
  stakeToken: StakeTokenInfo;
  feePercent: number;
  rewardToken: RewardToken;
  leverageInfo: any;
};

export type EmptyState = {
  mainToken: EmptyStateItem;
  stakeToken: EmptyStateItem;
};

export type EmptyStateItem = {
  name: string;
  icon: string;
  balance: bigint;
  decimals: number;
};
