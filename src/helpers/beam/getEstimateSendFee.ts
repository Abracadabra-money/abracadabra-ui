import { ethers } from "ethers";
import type { Contract } from "ethers";
import { PACKET_TYPE, MESSAGE_VERSION } from "@/constants/beam";

export const adapterParams = async (
  contract: Contract,
  address: string,
  dstAmount: string,
  dstChainId: number
): Promise<String> => {
  const dstNativeAmount = ethers.utils.parseEther(dstAmount.toString() || "0");
  const minGas = await contract.minDstGasLookup(dstChainId, PACKET_TYPE);

  if (minGas.eq(0)) console.log("Error min gas");

  return ethers.utils.solidityPack(
    ["uint16", "uint256", "uint256", "address"],
    [MESSAGE_VERSION, minGas, dstNativeAmount, address]
  );
};

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
