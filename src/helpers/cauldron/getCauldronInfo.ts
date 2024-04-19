import type { Address } from "viem";
import type { providers } from "ethers";
import bentoBoxAbi from "@/abis/bentoBox";
import cauldronsConfig from "@/configs/cauldrons";
import type { CauldronInfo } from "@/helpers/cauldron/types";
import { getContracts } from "@/helpers/cauldron/getContracts";
import { getMainParams } from "@/helpers/cauldron/getMainParams";
import { getPublicClient } from "@/helpers/chains/getChainsInfo";
import { getUserPositions } from "@/helpers/cauldron/getUserPositions";
import { getUserTokensInfo } from "@/helpers/cauldron/getUserTokensInfo";
import { getAdditionalInfo } from "@/helpers/cauldron/getAdditionalInfo";

const getContractsInfo = async (
  chainId: number,
  address: Address | string,
  abi: any
) => {
  const publicClient = getPublicClient(chainId);

  const [bentoBoxAddress, masterContractAddress] = await publicClient.multicall(
    {
      contracts: [
        {
          address: address,
          abi: abi,
          functionName: "bentoBox",
          args: [],
        },
        {
          address: address,
          abi: abi,
          functionName: "masterContract",
          args: [],
        },
      ],
    }
  );

  return {
    bentoBoxContract: {
      address: bentoBoxAddress.result,
      abi: bentoBoxAbi,
    },
    masterContract: {
      address: masterContractAddress.result,
      abi: null,
    },
  };
};

export const getCauldronInfo = async (
  cauldronId: number,
  chainId: number,
  address: Address
): Promise<CauldronInfo | null> => {
  const config = cauldronsConfig.find(
    (config) => +config.id === +cauldronId && +config.chainId === +chainId
  );

  if (!config) return null;

  const { bentoBoxContract, masterContract } = await getContractsInfo(
    chainId,
    config.contract.address,
    config.contract.abi
  );

  const mainParams = await getMainParams([config], chainId, config.contract);

  const userPositions = await getUserPositions([config], address, chainId);

  const userTokensInfo = await getUserTokensInfo(
    chainId,
    address,
    config,
    bentoBoxContract
  );

  const additionalInfo = await getAdditionalInfo(
    chainId,
    config,
    address,
    masterContract,
    bentoBoxContract
  );

  const contracts = await getContracts(config, bentoBoxContract);

  return {
    config,
    contracts,
    mainParams: mainParams[0],
    userPosition: userPositions[0],
    userTokensInfo,
    additionalInfo,
  };
};
