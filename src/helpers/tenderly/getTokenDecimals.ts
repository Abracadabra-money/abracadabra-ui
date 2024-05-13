import { erc20Abi, type Address } from "viem";
import { getPublicClient } from "@/helpers/chains/getChainsInfo";

export const getTokenDecimals = async (
  tokenAddress: Address,
  chainId: number
) => {
  const publicClient = getPublicClient(chainId);

  return await publicClient.readContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: "decimals",
  });
};
