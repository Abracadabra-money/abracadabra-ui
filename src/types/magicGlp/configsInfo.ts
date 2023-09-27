import type { ContractInfo } from "@/types/global";
import type {
  MainTokenInfo,
  StakeTokenInfo,
  RewardTokenInfo,
} from "@/types/magicGlp/tokensInfo";

export type MagicGlpConfigs = {
  42161: ChainConfig;
  43114: ChainConfig;
};

export type ChainConfig = {
  harvestor: ContractInfo;
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
  additionalInfo: any;
};

export type StakeInfo = {
  mainToken: MainTokenInfo;
  stakeToken: StakeTokenInfo;
  feePercent: number;
  rewardToken: RewardTokenInfo;
  leverageInfo: any;
};
