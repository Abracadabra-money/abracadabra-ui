import { KAVA_CHAIN_ID } from "@/constants/global";
import { useImage } from "@/helpers/useImage";
import type { EmptyState } from "@/types/magicKlp/stakeInfo";
import { magicKlpConfig } from "@/utils/stake/magicKlpConfig";

const { mainToken, stakeToken } =
  magicKlpConfig[KAVA_CHAIN_ID as keyof typeof magicKlpConfig];

export const emptyState: EmptyState = {
  mainToken: {
    name: mainToken.name,
    icon: mainToken.icon,
    balance: 0n,
    balanceUsd: 0n,
    rate: 1000000000000000000n,
    decimals: 18,
    rateIcon: useImage("assets/images/tokens/KLP.png"),
  },
  stakeToken: {
    name: stakeToken.name,
    icon: stakeToken.icon,
    balance: 0n,
    balanceUsd: 0n,
  },
};
