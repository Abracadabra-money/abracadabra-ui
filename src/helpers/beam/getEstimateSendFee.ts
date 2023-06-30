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

  const fees = await contract.estimateSendFee(
    dstChainId,
    ethers.utils.defaultAbiCoder.encode(["address"], [address]),
    ethers.utils.parseUnits(mimAmount, 18),
    false,
    params
  );

  return { fees, params };
};
