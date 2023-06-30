import { ethers, BigNumber } from "ethers";

export const GAS_LIMIT: number = 1000;

export const sendFrom = async (
  fees: Array<BigNumber>,
  adapterParams: string,
  mimAmount: BigNumber,
  { contract, account, dstChainId, toAddressBytes }: any
): Promise<Object> => {
  const estimateGas = await contract.estimateGas.sendFrom(
    account, // 'from' address to send tokens
    dstChainId, // remote LayerZero chainId
    toAddressBytes, // 'to' address to send tokens
    mimAmount, // amount of tokens to send (in wei)
    [account, ethers.constants.AddressZero, adapterParams], // flexible bytes array to indicate messaging adapter services
    {
      value: fees[0],
    }
  );

  const gasLimit = GAS_LIMIT + +estimateGas.toString();

  return await contract.sendFrom(
    account,
    dstChainId,
    toAddressBytes,
    mimAmount,
    [account, ethers.constants.AddressZero, adapterParams],
    {
      gasLimit,
      value: fees[0],
    }
  );
};
