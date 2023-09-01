import { getAccount } from "@wagmi/core";
import { magicApeConfigViem } from "@/utils/stake/magicApeConfigViem";
import { getTokensInfoViem } from "@/helpers/stake/magicApe/getTokensInfoViem";
import { getAdditionalInfoViem } from "@/helpers/stake/magicApe/getAdditionalInfoViem";
import { MAINNET_CHAIN_ID } from "@/constants/global";
import type { EmptyState, StakeInfo } from "@/types/magicApe/configsInfo";

const emptyState: EmptyState = {
  mainToken: {
    name: magicApeConfigViem[
      MAINNET_CHAIN_ID as keyof typeof magicApeConfigViem
    ].mainToken.name,
    icon: magicApeConfigViem[
      MAINNET_CHAIN_ID as keyof typeof magicApeConfigViem
    ].mainToken.icon,
    balance: 0n,
  },
  stakeToken: {
    name: magicApeConfigViem[
      MAINNET_CHAIN_ID as keyof typeof magicApeConfigViem
    ].stakeToken.name,
    icon: magicApeConfigViem[
      MAINNET_CHAIN_ID as keyof typeof magicApeConfigViem
    ].stakeToken.icon,
    balance: 0n,
  },
};

export const getStakeInfoViem = async (
  chainId: number
): Promise<StakeInfo | EmptyState> => {
  const config = magicApeConfigViem[chainId as keyof typeof magicApeConfigViem];
  const account = getAccount().address;
  if (!config || !account) return emptyState;

  const { mainToken, stakeToken, tokensRate } = await getTokensInfoViem(
    account,
    config
  );

  const additionalInfo = await getAdditionalInfoViem(config);

  return {
    mainToken,
    stakeToken,
    tokensRate,
    ...additionalInfo,
  };
};
