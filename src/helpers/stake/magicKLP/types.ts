import type { MainTokenInfo, StakeTokenInfo } from "@/helpers/stake/types";

export type MagicKlpStakeInfo = {
  chainId: number;
  mainToken: MainTokenInfo;
  stakeToken: StakeTokenInfo;
};
