import { ethers } from "ethers";
import type { BeamInfo, BeamConfig } from "./types";

const MESSAGE_VERSION: number = 2;

import { getPublicClient } from "@/helpers/chains/getChainsInfo";

export const getEstimateSendFee = async (
  beamInfo: BeamInfo,
  dstChainInfo: BeamConfig,
  address: string,
  dstNativeAmount: bigint = 0n,
  mimAmount: bigint = 0n
): Promise<Object> => {
  const dstInfo = beamInfo.destinationChainsInfo.find(
    (config) => config.chainConfig.chainId === dstChainInfo.chainId
  );

  const minGas = dstInfo!.minDstGasLookupResult;

  const params = ethers.utils.solidityPack(
    ["uint16", "uint256", "uint256", "address"],
    [MESSAGE_VERSION, minGas, dstNativeAmount, address]
  );

  const itsV2 = beamInfo.fromChainConfig.settings.contractVersion === 2;

  const methodName = itsV2 ? "estimateSendFeeV2" : "estimateSendFee";

  const args = itsV2
    ? [
        dstChainInfo.settings.lzChainId,
        ethers.utils.defaultAbiCoder.encode(["address"], [address]),
        mimAmount,
        params,
      ]
    : [
        dstChainInfo.settings.lzChainId,
        ethers.utils.defaultAbiCoder.encode(["address"], [address]),
        mimAmount,
        false,
        params,
      ];

  const publicClient = getPublicClient(beamInfo.fromChainConfig.chainId);

  const fees = await publicClient.readContract({
    address: beamInfo.fromChainConfig.contract.address,
    abi: beamInfo.fromChainConfig.contract.abi,
    functionName: methodName,
    args,
  });

  return { fees, params };
};
