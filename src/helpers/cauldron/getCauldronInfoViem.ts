import type { providers } from "ethers";
import { getAccount } from "@wagmi/core";
import cauldronsConfig from "@/utils/cauldronsConfig";
import type { CauldronInfo } from "@/types/cauldron/index";
import { getPublicClient } from "@/helpers/getPublicClient";
import { getMainParamsViem } from "@/helpers/cauldron/getMainParamsViem";
import { getUserPositionsViem } from "@/helpers/cauldron/getUserPositionsViem";
import { getUserTokensInfoViem } from "@/helpers/cauldron/getUserTokensInfoViem";
import { getAdditionalInfoViem } from "@/helpers/cauldron/getAdditionalInfoViem";

export const getCauldronInfoViem = async (
  cauldronId: number,
  chainId: number,
  provider: providers.BaseProvider,
  signer: providers.JsonRpcSigner
): Promise<CauldronInfo | null> => {
  const { address } = getAccount();
  const contractProvider = address ? signer : provider;

  const config = cauldronsConfig.find(
    (config) => config.id === cauldronId && config.chainId === chainId
  );

  if (!config) return null;

  const publicClient = getPublicClient(chainId);

  const mainParams = await getMainParamsViem([config], publicClient);

  const userPositions = await getUserPositionsViem(
    [config],
    publicClient,
    address
  );

  const userTokensInfo = await getUserTokensInfoViem(
    config,
    address,
    publicClient
  );

  const additionalInfo = await getAdditionalInfoViem(
    config,
    address,
    publicClient,
    contractProvider
  );

  return {
    config,
    mainParams: mainParams[0],
    userPosition: userPositions[0],
    userTokensInfo,
    additionalInfo,
  };
};
