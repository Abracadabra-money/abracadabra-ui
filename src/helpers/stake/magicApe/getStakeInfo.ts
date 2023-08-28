import { getAccount } from "@wagmi/core";
import { MulticallWrapper } from "ethers-multicall-provider";
import { magicApeConfig } from "@/utils/stake/magicApeConfig";
import { getContracts } from "@/helpers/stake/magicApe/getContracts";
import { getTokensInfo } from "@/helpers/stake/magicApe/getTokensInfo";
import { getAdditionalInfo } from "@/helpers/stake/magicApe/getAdditionalInfo";

const emptyState = {
  mainToken: {
    name: magicApeConfig[1].mainToken.name,
    icon: magicApeConfig[1].mainToken.icon,
    balance: "0",
  },
  stakeToken: {
    name: magicApeConfig[1].stakeToken.name,
    icon: magicApeConfig[1].stakeToken.icon,
    balance: "0",
  },
};

export const getStakeInfo = async (
  provider: any,
  signer: any,
  chainId: number
) => {
  const config = magicApeConfig[chainId as keyof typeof magicApeConfig];
  const account = getAccount().address;
  if (!config || !account) return emptyState;

  const userSigner = account ? signer : provider;
  const multicallProvider = MulticallWrapper.wrap(provider);
  const multicallContracts = await getContracts(multicallProvider, config);

  const { mainToken, stakeToken } = await getTokensInfo(
    multicallContracts,
    userSigner,
    account,
    config
  );

  const additionalInfo = await getAdditionalInfo(multicallContracts, config);

  return {
    ...additionalInfo,
    mainToken,
    stakeToken,
  };
};
