import { parseUnits } from "viem";
import { Contract, providers } from "ethers";
import { erc20Abi, type Address } from "viem";
import { sendTransaction } from "@/helpers/tenderly/sendTransaction";
import { getTokenHolders } from "@/helpers/tenderly/getTokenHolders";
import { getTokenDecimals } from "@/helpers/tenderly/getTokenDecimals";

export const tokenTransfer = async (
  chainId: number,
  tokenAddress: Address,
  toAddress: Address,
  amount: string,
  provider: providers.BaseProvider,
  holdersAddresses: any
) => {
  const holders = await getTokenHolders(
    chainId,
    tokenAddress,
    holdersAddresses
  );
  const decimals = await getTokenDecimals(tokenAddress);
  let parsedAmount = parseUnits(amount.toString(), decimals);
  const tokenContract = await new Contract(tokenAddress, erc20Abi, provider);

  for (let index = 0; index < holders.length; index++) {
    const { address, amount } = holders[index];
    const transactionAmount = parsedAmount <= amount ? parsedAmount : amount;

    await sendTransaction(
      tokenContract,
      address,
      "transfer",
      [toAddress, transactionAmount],
      provider
    );

    parsedAmount -= transactionAmount;
    if (!parsedAmount) return false;
  }
};
