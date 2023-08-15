import { getAccount } from "@wagmi/core";
import { MulticallWrapper } from "ethers-multicall-provider";
import { magicGlpConfig } from "@/utils/stake/magicGlpConfig";
import { getContracts } from "@/helpers/stake/magicGlp/getContracts";
import { getTokensInfo } from "@/helpers/stake/magicGlp/getTokensInfo";
import { getAdditionalInfo } from "@/helpers/stake/magicGlp/getAdditionalInfo";

export const getStakeInfo = async (
  provider: any,
  signer: any,
  chainId: number
) => {
  const config = magicGlpConfig[chainId as keyof typeof magicGlpConfig];
  const account = getAccount().address;
  if (!config || !account) return false; //emptyState

  const userSigner = account ? signer : provider;
  const multicallProvider = MulticallWrapper.wrap(provider);
  const multicallContracts = await getContracts(multicallProvider, config);

  const { mainToken, stakeToken } = await getTokensInfo(
    multicallContracts,
    account,
    config,
    userSigner
  );

  const additionalInfo = await getAdditionalInfo(multicallContracts, config);

  return {
    ...additionalInfo,
    mainToken,
    stakeToken,
  };
};
