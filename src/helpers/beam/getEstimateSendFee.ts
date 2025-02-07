import { ethers } from "ethers";
import type { BeamInfo, BeamConfig } from "./types";

const MESSAGE_VERSION: number = 2;

import { getPublicClient } from "@/helpers/chains/getChainsInfo";

export const getEstimateSendFee = async (
  fromChainInfo: any,
  dstChainInfo: any,
  address: string,
  dstNativeAmount: bigint = 0n,
  mimAmount: bigint = 0n
): Promise<any> => {
  const minGas = dstChainInfo!.minDstGasLookupResult;

  const params = ethers.utils.solidityPack(
    ["uint16", "uint256", "uint256", "address"],
    [MESSAGE_VERSION, minGas, dstNativeAmount, address]
  );

  const itsV2 = fromChainInfo.settings?.contractVersion === 2;

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

  const publicClient = getPublicClient(fromChainInfo.chainId);

  const fees = await publicClient.readContract({
    address: fromChainInfo.contract.address,
    abi: fromChainInfo.contract.abi,
    functionName: methodName,
    args,
  });

  const additionalFee = fees[0] / 100n;
  const updatedFee = fees[0] + additionalFee; // add 1% from base fee to be sure tx success

  return { fees: updatedFee, params };
};

export const quoteSendFee = async (
  fromChainConfig: BeamConfig,
  sendParam: any
): Promise<any> => {
  try {
    const publicClient = getPublicClient(fromChainConfig.chainId);

    return await publicClient.readContract({
      address: fromChainConfig.contract.address,
      abi: fromChainConfig.contract.abi,
      functionName: "quoteSend",
      args: [sendParam, false],
    });
  } catch (error) {
    console.error("Error quoteSendFee:", error);
    return { nativeFee: 0n, lzTokenFee: 0n };
  }
};
