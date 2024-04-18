import mimConfigs from "@/configs/tokens/mim";
import beamConfigs from "@/configs/beam/beamConfigs";
import type { Address } from "viem";
import { getPublicClient } from "@/helpers/chains/getChainsInfo";
import { getNativeTokensPrice } from "../prices/defiLlama";
import relayerAbi from "@/abis/beam/relayer.js";
import { tokensChainLink } from "@/configs/chainLink/config";
import { getTokenPriceByChain } from "@/helpers/prices/getTokenPriceByChain";
import { useImage } from "@/helpers/useImage";
import type {
  BeamInfo,
  BeamTokenConfig,
  BeamUserInfo,
  BeamConfig,
} from "./types";

const PACKET_TYPE: number = 0;

export const getBeamInfo = async (
  chainId: number,
  account: Address
): Promise<BeamInfo> => {
  const fromChainConfig = beamConfigs.find((item) => item.chainId === chainId);

  if (!fromChainConfig) {
    throw new Error("No Beam config found for chainId");
  }

  const mimConfig = mimConfigs.find(
    (item) => item.chainId === fromChainConfig.chainId
  );

  mimConfig.image = useImage("assets/images/tokens/MIM.png");

  const destinationChainsConfig = filterDestinationChains(
    fromChainConfig,
    beamConfigs
  );

  const userInfo = await getUserInfo(mimConfig, fromChainConfig, account);

  const publicClient = getPublicClient(fromChainConfig.chainId);

  const results = await publicClient.multicall({
    contracts: destinationChainsConfig
      .map((chainConfig: any) => {
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
    beamConfigs.map((config: BeamConfig) => config.chainId)
  );

  const destinationChainsInfo = destinationChainsConfig.map(
    (chainConfig: any, index: number) => {
      return {
        chainConfig,
        minDstGasLookupResult: results[index * 2].result,
        dstConfigLookupResult: results[index * 2 + 1].result[0],
        nativePrice:
          prices.find((info) => info.chainId === chainConfig.chainId)?.price ||
          0,
      };
    }
  );

  const mimPrice = await getTokenPriceByChain(
    tokensChainLink.mim.chainId,
    tokensChainLink.mim.address
  );

  return {
    beamConfigs: beamConfigs,
    fromChainConfig: fromChainConfig,
    destinationChainsInfo,
    tokenConfig: mimConfig as BeamTokenConfig,
    mimPrice,
    nativePrice:
      prices.find((info) => info.chainId === fromChainConfig.chainId)?.price ||
      0,
    userInfo,
  };
};

const getUserInfo = async (
  tokenConfig: any,
  beamConfig: any,
  account: Address
): Promise<BeamUserInfo> => {
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
