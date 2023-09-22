import type {
  MainTokenInfo,
  StakeTokenInfo,
} from "@/types/magicKlp/tokensInfo";

export type EmptyState = {
  mainToken: EmptyStateItem;
  stakeToken: EmptyStateItem;
};

export type EmptyStateItem = {
  name: string;
  icon: string;
  rate?: bigint;
  balance: BigInt;
};

export type StakeInfo = {
  mainToken: MainTokenInfo;
  stakeToken: StakeTokenInfo;
};
