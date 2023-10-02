import { getAccount } from "@wagmi/core";
import { magicApeConfig } from "@/utils/stake/magicApeConfig";
import { getTokensInfo } from "@/helpers/stake/magicApe/getTokensInfo";
import { getAdditionalInfo } from "@/helpers/stake/magicApe/getAdditionalInfo";
import { MAINNET_CHAIN_ID } from "@/constants/global";
import type { EmptyState, StakeInfo } from "@/types/magicApe/configsInfo";

export const getStakeInfo = async (
  chainId: number
): Promise<StakeInfo | EmptyState> => {
  const config = magicApeConfig[chainId as keyof typeof magicApeConfig];
  let account = getAccount().address;
  account = account ? account : "0x";
  if (!config) return emptyState;

  const { mainToken, stakeToken, tokensRate } = await getTokensInfo(
    account,
    config
  );

  const additionalInfo = await getAdditionalInfo(config);

  return {
    mainToken,
    stakeToken,
    tokensRate,
    ...additionalInfo,
  };
};

const emptyState: EmptyState = {
  mainToken: {
    name: magicApeConfig[MAINNET_CHAIN_ID as keyof typeof magicApeConfig]
      .mainToken.name,
    icon: magicApeConfig[MAINNET_CHAIN_ID as keyof typeof magicApeConfig]
      .mainToken.icon,
    decimals:
      magicApeConfig[MAINNET_CHAIN_ID as keyof typeof magicApeConfig].mainToken
        .decimals,
    balance: 0n,
  },
  stakeToken: {
    name: magicApeConfig[MAINNET_CHAIN_ID as keyof typeof magicApeConfig]
      .stakeToken.name,
    icon: magicApeConfig[MAINNET_CHAIN_ID as keyof typeof magicApeConfig]
      .stakeToken.icon,
    decimals:
      magicApeConfig[MAINNET_CHAIN_ID as keyof typeof magicApeConfig].stakeToken
        .decimals,
    balance: 0n,
  },
};
