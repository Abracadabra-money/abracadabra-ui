import { ethers, BigNumber } from "ethers";

export const GAS_LIMIT: number = 1000;

export const sendFrom = async (
  fees: Array<BigNumber>,
  adapterParams: string,
  mimAmount: BigNumber,
  { contract, account, dstChainId, toAddressBytes }: any
): Promise<Object> => {
  const itsV2 = contract.hasOwnProperty("sendProxyOFTV2");

  const methodName = itsV2 ? "sendProxyOFTV2" : "sendFrom";

  const args = [
    dstChainId, // remote LayerZero chainId
    toAddressBytes, // 'to' address to send tokens
    mimAmount, // amount of tokens to send (in wei)
    [account, ethers.constants.AddressZero, adapterParams], // flexible bytes array to indicate messaging adapter services
  ];

  if (!itsV2) args.unshift(account); // 'from' address to send tokens

  const estimateGas = await contract.estimateGas[methodName](...args, {
    value: fees[0],
  });

  const gasLimit = GAS_LIMIT + +estimateGas.toString();

  return await contract[methodName](...args, {
    gasLimit,
    value: fees[0],
  });
};
