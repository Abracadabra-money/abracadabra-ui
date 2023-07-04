import { getAccount } from "@wagmi/core";
import cauldronsConfig from "@/utils/cauldronsConfig";
import { MulticallWrapper } from "ethers-multicall-provider";
import { getContracts } from "@/helpers/cauldron/getContracts";
import { getMainParams } from "@/helpers/cauldron/getMainParams";
import { getUserPositions } from "@/helpers/cauldron/getUserPositions";
import { getUserTokensInfo } from "@/helpers/cauldron/getUserTokensInfo";
import type { providers } from "ethers";
import type { CauldronInfo } from "@/helpers/cauldron/types";

export const getCauldronInfo = async (
  cauldronId: number,
  chainId: number,
  provider: providers.BaseProvider,
  signer: providers.JsonRpcSigner
): Promise<CauldronInfo> => {
  const { address } = getAccount();
  const multicallProvider = MulticallWrapper.wrap(provider);

  const config = cauldronsConfig.find(
    (config) => +config.id === +cauldronId && +config.chainId === +chainId
  );

  const multicallContracts = await getContracts(config, multicallProvider);

  const mainParams = await getMainParams([config], multicallProvider);

  const userPositions = await getUserPositions(
    [config],
    multicallProvider,
    address,
    [multicallContracts?.cauldron]
  );

  const userTokensInfo = await getUserTokensInfo(
    multicallContracts,
    address,
    signer
  );

  const contracts = await getContracts(config, signer);

  return {
    config,
    contracts,
    mainParams: mainParams[0],
    userPosition: userPositions[0],
    userTokensInfo,
  };
};
