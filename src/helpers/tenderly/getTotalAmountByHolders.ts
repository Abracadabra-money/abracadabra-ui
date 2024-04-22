import { formatUnits, type Address } from "viem";
import { formatToFixed } from "@/helpers/filters";
import { getTokenHolders } from "@/helpers/tenderly/getTokenHolders";
import { getTokenDecimals } from "@/helpers/tenderly/getTokenDecimals";

export const getTotalAmountByHolders = async (
  chainId: number,
  tokenAddress: Address,
  holdersAddresses = ""
) => {
  const holders = await getTokenHolders(
    chainId,
    tokenAddress,
    holdersAddresses
  );

  const decimals = await getTokenDecimals(tokenAddress, chainId);

  if (holders.length === 0) return 0;
  if (holders.length === 1) {
    return formatToFixed(formatUnits(holders[0].amount, decimals), decimals);
  }

  const totalAmount = holders.reduce((acc: any, { amount }: any) => {
    if (acc?.amount) return acc?.amount + amount;
    return acc + amount;
  });

  return formatToFixed(formatUnits(totalAmount, decimals), decimals);
};
