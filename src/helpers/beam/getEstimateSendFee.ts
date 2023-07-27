import { ethers } from "ethers";
import type { Contract } from "ethers";
import { adapterParams } from "@/helpers/beam/getAdapterParams";

export const getEstimateSendFee = async (
  contract: Contract,
  address: string,
  dstChainId: number,
  dstAmount: string = "0",
  mimAmount: string = "1"
): Promise<Object> => {
  const params = await adapterParams(contract, address, dstAmount, dstChainId);

  const itsV2 = contract.hasOwnProperty("estimateSendFeeV2");

  const methodName = itsV2 ? "estimateSendFeeV2" : "estimateSendFee";
  console.log("here")
  const args = itsV2
    ? [
        dstChainId,
        ethers.utils.defaultAbiCoder.encode(["address"], [address]),
        ethers.utils.parseUnits(mimAmount, 18),
        params,
      ]
    : [
        dstChainId,
        ethers.utils.defaultAbiCoder.encode(["address"], [address]),
        ethers.utils.parseUnits(mimAmount, 18),
        false,
        params,
      ];

    console.log("here")
  const fees = await contract[methodName](...args);

  return { fees, params };
};
