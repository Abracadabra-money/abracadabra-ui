import type { Address } from "viem";
import relayerAbi from "@/abis/beam/relayer";
import mimConfigs from "@/configs/tokens/mim";
import { useImage } from "@/helpers/useImage";
import executorAbi from "@/abis/beam/executor";
import spellConfigs from "@/configs/tokens/spell";
import { beamConfigs } from "@/configs/beam/beamConfigs";
import { tokensChainLink } from "@/configs/chainLink/config";
import { getPublicClient } from "@/helpers/chains/getChainsInfo";
import { getNativeTokensPrice } from "@/helpers/prices/defiLlama";
import type { BeamUserInfo, BeamConfig } from "@/helpers/beam/types";
import type { BeamInfo, BeamTokenConfig } from "@/helpers/beam/types";
import { getTokenPriceByChain } from "@/helpers/prices/getTokenPriceByChain";

const PACKET_TYPE: number = 1;

export const getBeamInfo = async (
  chainId: number,
  account: Address | null = null,
  tokenType: number = 0
): Promise<BeamInfo> => {
  const configs = beamConfigs[tokenType];

  const fromChainConfig = configs.find(
    (item: BeamConfig) => item.chainId === chainId
  );

  if (!fromChainConfig) {
    throw new Error("No Beam config found for chainId");
  }

  const { tokenConfig, tokenPrice } = await getTokenInfo(
    tokenType,
    fromChainConfig
  );

  const destinationChainsConfig = filterDestinationChains(
    fromChainConfig,
    configs
  );

  const userInfo = await getUserInfo(tokenConfig, fromChainConfig, account);

  const publicClient = getPublicClient(fromChainConfig.chainId);

  const results = await publicClient.multicall({
    contracts: destinationChainsConfig
      .map((chainConfig: any) => {
        if (chainConfig.settings?.lzVersion === 2) {
          return [
            {
              address: chainConfig.executor,
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

  const prices = await getNativeTokensPrice(
    configs.map((config: BeamConfig) => config.chainId)
  );

  const destinationChainsInfo = destinationChainsConfig.map(
    (chainConfig: BeamConfig, index: number) => {
      const isLzVersion2 = chainConfig.settings?.lzVersion === 2;

      const minDstGasLookupResult = isLzVersion2
        ? 0n
        : results[index * 2]?.result || 0n;

      const dstConfigLookupResult = isLzVersion2
        ? results[index]?.result
          ? results[index]?.result[3]
          : 0n
        : results[index * 2 + 1]?.result[0] || 0n;

      return {
        chainConfig,
        minDstGasLookupResult,
        dstConfigLookupResult,
        nativePrice:
          prices.find((info) => info.chainId === chainConfig.chainId)?.price ||
          0,
      };
    }
  );

  const nativePrice =
    prices.find((info) => info.chainId === fromChainConfig.chainId)?.price || 0;

  return {
    beamConfigs: configs,
    fromChainConfig: fromChainConfig,
    destinationChainsInfo,
    tokenConfig: tokenConfig as BeamTokenConfig,
    tokenPrice,
    nativePrice,
    userInfo,
  };
};

const getTokenInfo = async (tokenType: number, fromChainConfig: any) => {
  const tokenConfig =
    tokenType === 0
      ? mimConfigs.find((item) => item.chainId === fromChainConfig.chainId)
      : spellConfigs.find((item) => item.chainId === fromChainConfig.chainId);

  if (tokenType === 0) {
    tokenConfig!.image = useImage("assets/images/tokens/MIM.png");
  }

  const activeTokenSymbol = tokenType === 0 ? "mim" : "spell";

  const tokenPrice = await getTokenPriceByChain(
    tokensChainLink[activeTokenSymbol].chainId,
    tokensChainLink[activeTokenSymbol].address
  );

  return { tokenConfig, tokenPrice };
};

const getUserInfo = async (
  tokenConfig: any,
  beamConfig: any,
  account: Address | null
): Promise<BeamUserInfo> => {
  if (!account) {
    return {
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
