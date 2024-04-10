import type { Address } from "viem";
import type { providers } from "ethers";
import cauldronsConfig from "@/configs/cauldrons";
import type { CauldronInfo } from "@/helpers/cauldron/types";
import { MulticallWrapper } from "ethers-multicall-provider";
import { getContracts } from "@/helpers/cauldron/getContracts";
import { getMainParams } from "@/helpers/cauldron/getMainParams";
import { getUserPositions } from "@/helpers/cauldron/getUserPositions";
import { getUserTokensInfo } from "@/helpers/cauldron/getUserTokensInfo";
import { getAdditionalInfo } from "@/helpers/cauldron/getAdditionalInfo";

export const getCauldronInfo = async (
  cauldronId: number,
  chainId: number,
  provider: providers.BaseProvider,
  signer: providers.JsonRpcSigner,
  address: Address
): Promise<CauldronInfo | null> => {
  const userSigner = address ? signer : provider;

  // const multicallProvider = MulticallWrapper.wrap(provider);
  // NOTICE: BERA TEST
  const multicallProvider =
    +chainId === 80085 ? provider : MulticallWrapper.wrap(provider);

  const config = cauldronsConfig.find(
    (config) => +config.id === +cauldronId && +config.chainId === +chainId
  );

  if (!config) return null;

  const multicallContracts = await getContracts(config, multicallProvider);

  const mainParams = await getMainParams([config], chainId, config.contract);

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
    provider
  );

  const additionalInfo = await getAdditionalInfo(
    multicallContracts,
    address,
    config,
    chainId,
    userSigner
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
