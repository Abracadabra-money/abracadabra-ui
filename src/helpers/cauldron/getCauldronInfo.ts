import { getAccount } from "@wagmi/core";
import cauldronsConfig from "@/utils/cauldronsConfig";
import { MulticallWrapper } from "ethers-multicall-provider";
import { getContracts } from "@/helpers/cauldron/getContracts";
import { getMainParams } from "@/helpers/cauldron/getMainParams";
import { getUserPositions } from "@/helpers/cauldron/getUserPositions";
import { getUserTokensInfo } from "@/helpers/cauldron/getUserTokensInfo";
import { getAdditionalInfo } from "@/helpers/cauldron/getAdditionalInfo";
import type { providers } from "ethers";
import type { CauldronInfo } from "@/helpers/cauldron/types";

export const getCauldronInfo = async (
  cauldronId: number,
  chainId: number,
  provider: providers.BaseProvider,
  signer: providers.JsonRpcSigner
): Promise<CauldronInfo | null> => {
  const { address } = getAccount();
  const userSigner = address ? signer : provider;
  const multicallProvider = MulticallWrapper.wrap(provider);

  const config = cauldronsConfig.find(
    (config) => +config.id === +cauldronId && +config.chainId === +chainId
  );

  if (!config) return null;

  const multicallContracts = await getContracts(config, multicallProvider);

  const mainParams = await getMainParams([config], multicallProvider, chainId);

  const userPositions = await getUserPositions(
    [config],
    multicallProvider,
    address,
    [multicallContracts?.cauldron],
    chainId
  );

  const userTokensInfo = await getUserTokensInfo(
    multicallContracts,
    address,
    signer
  );

  const additionalInfo = await getAdditionalInfo(
    multicallContracts,
    address,
    config
  );

  const contracts = await getContracts(config, userSigner);

  return {
    config,
    contracts,
    mainParams: mainParams[0],
    userPosition: userPositions[0],
    userTokensInfo,
    additionalInfo,
  };
};
