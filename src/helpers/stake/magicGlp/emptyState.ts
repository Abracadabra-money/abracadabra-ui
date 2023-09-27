import { ARBITRUM_CHAIN_ID } from "@/constants/global";
import { magicGlpConfig } from "@/utils/stake/magicGlpConfig";
import type { EmptyState } from "@/types/magicGlp/additionalInfo";

const { mainToken, stakeToken } =
  magicGlpConfig[ARBITRUM_CHAIN_ID as keyof typeof magicGlpConfig];

export const emptyState: EmptyState = {
  mainToken: {
    name: mainToken.name,
    icon: mainToken.icon,
    balance: 0n,
    balanceUsd: 0n,
    rate: 1000000000000000000n,
    decimals: 18,
  },
  stakeToken: {
    name: stakeToken.name,
    icon: stakeToken.icon,
    balance: 0n,
    balanceUsd: 0n,
  },
};
