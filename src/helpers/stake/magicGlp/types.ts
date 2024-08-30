import type {
  LeverageInfo,
  MainTokenInfo,
  StakeTokenInfo,
  RewardTokenInfo,
} from "@/helpers/stake/types";

export type MagicGlpStakeInfo = {
  chainId: number;
  mainToken: MainTokenInfo;
  stakeToken: StakeTokenInfo;
  feePercent: number;
  rewardToken: RewardTokenInfo;
  leverageInfo: LeverageInfo;
};

export type GlpData = {
  cumulativeDistributedUsdPerGlp: number;
  distributedUsdPerGlp: number;
  glpPrice: number;
  timestamp: number;
};
