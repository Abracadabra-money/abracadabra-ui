import type {
  LeverageInfo,
  MainTokenInfo,
  StakeTokenInfo,
  RewardTokenInfo,
} from "@/helpers/stake/types";

export type MagicApeStakeInfo = {
  chainId: number;
  mainToken: MainTokenInfo;
  stakeToken: StakeTokenInfo;
  feePercent: number;
  rewardToken: RewardTokenInfo;
  leverageInfo: LeverageInfo;
};
