import type { Address } from "viem";
import relayerAbi from "@/abis/beam/relayer";
import mimConfigs from "@/configs/tokens/mim";
import executorAbi from "@/abis/beam/executor";
import spellConfigs from "@/configs/tokens/spell";
import { beamConfigs } from "@/configs/beam/beamConfigs";
import { getPublicClient } from "@/helpers/chains/getChainsInfo";
import { getNativeTokensPrice } from "@/helpers/prices/defiLlama";
import type { BeamUserInfo, BeamConfig } from "@/helpers/beam/types";
import type { BeamInfo, BeamTokenConfig } from "@/helpers/beam/types";

const PACKET_TYPE: number = 1;

export const getBeamInfo = async (
  chainId: number,
  account: Address | null = null,
  tokenType: number = 0
): Promise<BeamInfo[]> => {
  const configs = beamConfigs[tokenType];

  const fromChainConfig = configs.find(
    (item: BeamConfig) => item.chainId === chainId
  );

  const fromChainConfigV2 = configs.find(
    (item: BeamConfig) =>
      item.chainId === chainId && item.settings.lzVersion === 2
  );

  if (!fromChainConfig) {
    throw new Error("No Beam config found for chainId");
  }

  const destinationChainsConfig = filterDestinationChains(
    fromChainConfig,
    configs
  );

  const userInfotest = await Promise.all(
    configs.map((config: BeamConfig) => {
      const tokenConfig =
        tokenType === 0
          ? mimConfigs.find((item) => item.chainId === config.chainId)
          : spellConfigs.find((item) => item.chainId === config.chainId);

      return getUserInfo(tokenConfig, config, account);
    })
  );

  const publicClient = getPublicClient(fromChainConfig.chainId);

  const results = await publicClient.multicall({
    contracts: destinationChainsConfig
      .map((chainConfig: any) => {
        if (chainConfig.settings?.lzVersion === 2 && fromChainConfigV2) {
          return [
            {
              address: fromChainConfigV2.executor,
              abi: executorAbi,
              functionName: "dstConfig",
              args: [chainConfig.settings.lzChainId],
            },
          ];
        } else
          return [
            {
              address: fromChainConfig.contract.address,
              abi: fromChainConfig.contract.abi,
              functionName: "minDstGasLookup",
              args: [chainConfig.settings.lzChainId, PACKET_TYPE],
            },
            {
              address: fromChainConfig.relayer,
              abi: relayerAbi,
              functionName: "dstConfigLookup",
              args: [
                chainConfig.settings.lzChainId,
                fromChainConfig.outboundProofType,
              ],
            },
          ];
      })
      .flat(2),
  });

  const beraPublicClient = getPublicClient(80094);

  const beraResult = await beraPublicClient.readContract({
    address: "0x4208D6E27538189bB48E603D6123A94b8Abe0A0b",
    abi: executorAbi,
    functionName: "dstConfig",
    args: [30101],
  });

  const prices = await getNativeTokensPrice(
    configs.map((config: BeamConfig) => config.chainId)
  );

  const destinationChainsInfo = destinationChainsConfig.map(
    (chainConfig: BeamConfig, index: number) => {
      if (fromChainConfig.chainId === 80094) {
        return {
          chainConfig,
          minDstGasLookupResult: 0n,
          dstConfigLookupResult: beraResult[3],
          nativePrice:
            prices.find((info) => info.chainId === chainConfig.chainId)
              ?.price || 0,
        };
      }

      const isLzVersion2 = chainConfig.settings?.lzVersion === 2;

      const minDstGasLookupResult = isLzVersion2
        ? 0n
        : results[index * 2]?.result || 0n;

      const dstConfigLookupResult = isLzVersion2
        ? !!results[index * 2]?.result
          ? results[index * 2]?.result[3]
          : 0n
        : results[index * 2 + 1]?.result
        ? results[index * 2 + 1]?.result[0]
        : 0n;

      return {
        chainConfig,
        minDstGasLookupResult,
        dstConfigLookupResult,
      };
    }
  );

  const configsArr = configs.map((config: BeamConfig, index) => {
    const tokenConfig =
      tokenType === 0
        ? mimConfigs.find((item) => item.chainId === config.chainId)
        : spellConfigs.find((item) => item.chainId === config.chainId);

    return {
      ...config,
      nativePrice:
        prices.find((info) => info.chainId === config.chainId)?.price || 0,
      dstConfigLookupResult:
        (destinationChainsInfo.find(
          (info) => info.chainConfig.chainId === config.chainId
        )?.dstConfigLookupResult as bigint) || 0n,
      minDstGasLookupResult:
        (destinationChainsInfo.find(
          (info) => info.chainConfig.chainId === config.chainId
        )?.minDstGasLookupResult as bigint) || 0n,
      userInfo: userInfotest[index],
      tokenConfig: tokenConfig as BeamTokenConfig,
    };
  });

  return configsArr;
};

const getUserInfo = async (
  tokenConfig: any,
  beamConfig: any,
  account: Address | null
): Promise<BeamUserInfo> => {
  if (!account) {
    return {
      chainId: beamConfig.chainId,
      balance: 0n,
      allowance: 0n,
      nativeBalance: 0n,
    };
  }

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

  const nativeBalance = await publicClient.getBalance({ address: account });

  return {
    chainId: beamConfig.chainId,
    balance: balance.result,
    allowance: allowance.result,
    nativeBalance,
  };
};

const filterDestinationChains = (
  fromChainConfig: BeamConfig,
  beamConfigs: BeamConfig[]
) => {
  return beamConfigs.filter((chainConfig: any) => {
    const isFromChain = chainConfig.chainId === fromChainConfig.chainId;
    const isDisabled =
      fromChainConfig.settings.disabledDestinationChains.includes(
        chainConfig.chainId
      );

    return !isFromChain && !isDisabled;
  });
};
