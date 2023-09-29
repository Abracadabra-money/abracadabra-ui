import { ethers } from "ethers";
import type { Address } from "viem";

export const sendTransaction = async (
  contract: any,
  fromAddress: Address | string,
  method: string,
  transactionArgs: any[],
  provider: any
): Promise<string> => {
  const unsignedTx = await contract.populateTransaction[method](
    ...transactionArgs
  );

  return await provider.send("eth_sendTransaction", [
    {
      to: contract.address,
      from: fromAddress,
      data: unsignedTx.data,
      value: ethers.utils.hexValue(0),
    },
  ]);
};
