import { ethers } from "ethers";
import type { Contract } from "ethers";

const PACKET_TYPE: number = 0;
const MESSAGE_VERSION: number = 2;

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
