import { ethers } from "ethers";

export const adapterParams = async (
  contract: any,
  address: string,
  dstAmount: any,
  dstChainId: any
) => {
  const packetType = 0;
  const messageVersion = 2;
  const dstNativeAmount = ethers.utils.parseEther(dstAmount.toString() || "0");
  const minGas = await contract.minDstGasLookup(dstChainId, packetType);

  if (minGas.eq(0)) console.log("Error min gas");

  return ethers.utils.solidityPack(
    ["uint16", "uint256", "uint256", "address"],
    [messageVersion, minGas, dstNativeAmount, address]
  );
};

export const getEstimatedGasCost = async (
  contract: any,
  address: string,
  dstChainId: any,
  dstAmount = "0",
  mimAmount = "1"
) => {
  if (!+mimAmount) return 0;

  return await contract.estimateSendFee(
    dstChainId,
    ethers.utils.defaultAbiCoder.encode(["address"], [address]),
    ethers.utils.parseUnits(mimAmount, 18),
    false,
    adapterParams(contract, address, dstAmount, dstChainId)
  );
};

export const getEstimatedGasCostNew = async (
  contract: any,
  address: string,
  dstChainId: any,
  dstAmount = "0",
  mimAmount = "1"
) => {
  if (!+mimAmount) return 0;
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
