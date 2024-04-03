import mimConfigs from "@/configs/tokens/mim";
import beamConfigs from "@/configs/beam/beamConfigs";
import type { Address } from "viem";
import { getPublicClient } from "@/helpers/chains/getChainsInfo";

//
// import relayerAbi from "@/abis/beam/relayer.js";
// const PACKET_TYPE: number = 0;
// const TEST_RELAYER_ADDRESS = "0x";
// const outboundProofTypeTEST = 0;

export const getBeamInfo = async (
  chainId: number,
  account: Address
): Promise<any> => {
  const fromChainConfig = beamConfigs.find((item) => item.chainId === chainId);

  if (!fromChainConfig) {
    throw new Error("No Beam config found for chainId");
  }

  const mimConfig = mimConfigs.find(
    (item) => item.chainId === fromChainConfig.chainId
  );

  const destinationChainsConfig = filterDestinationChains(
    fromChainConfig,
    beamConfigs
  );

  const userInfo = await getUserInfo(mimConfig, fromChainConfig, account);

  //   const publicClient = getPublicClient(fromChainConfig.chainId);

  //   const results = await publicClient.multicall({
  //     contracts: destinationChainsConfig
  //       .map((chainConfig: any) => {
  //         return [
  //           {
  //             address: fromChainConfig.contract.address,
  //             abi: fromChainConfig.contract.abi,
  //             functionName: "minDstGasLookup",
  //             args: [chainConfig.settings.lzChainId, PACKET_TYPE],
  //           },
  //           {
  //             address: TEST_RELAYER_ADDRESS,
  //             abi: relayerAbi,
  //             functionName: "dstConfigLookup",
  //             args: [chainConfig.settings.lzChainId, outboundProofTypeTEST],
  //           },
  //         ];
  //       })
  //       .flat(2),
  //   });

  //   const parsedResults = destinationChainsConfig.map(
  //     (chainConfig: any, index: number) => {
  //       return {
  //         chainConfig,
  //         minDstGasLookupResult: results[index * 2],
  //         dstConfigLookupResult: results[index * 2 + 1],
  //       };
  //     }
  //   );

  return {
    config: fromChainConfig,
    destinationChainsConfig,
    tokenConfig: mimConfig,
    userInfo,
  };
};

const getUserInfo = async (
  tokenConfig: any,
  beamConfig: any,
  account: Address
): Promise<any> => {
  const publicClient = getPublicClient(beamConfig.chainId);

  const [balance, allowance] = await publicClient.multicall({
    contracts: [
      {
        address: tokenConfig.address,
        abi: tokenConfig.abi,
        functionName: "balanceOf",
        args: [account],
      },
      {
        address: tokenConfig.address,
        abi: tokenConfig.abi,
        functionName: "allowance",
        args: [account, beamConfig.contract.address],
      },
    ],
  });

  const nativeBalance = await publicClient.getBalance(account);

  return {
    balance: balance.response,
    allowance: allowance.response,
    nativeBalance,
  };
};

const filterDestinationChains = (fromChainConfig: any, beamConfigs: any) => {
  return beamConfigs.filter((chainConfig: any) => {
    const isFromChain = chainConfig.chainId === fromChainConfig.chainId;
    const isDisabled =
      fromChainConfig.settings.disabledDestinationChains.includes(
        chainConfig.chainId
      );

    return !isFromChain && !isDisabled;
  });
};
