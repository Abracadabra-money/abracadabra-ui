import type { Address } from "viem";
import { erc20ABI, readContract } from "@wagmi/core";

export const getTokenDecimals = async (tokenAddress: Address) => {
  return await readContract({
    address: tokenAddress,
    abi: erc20ABI,
    functionName: "decimals",
  });
};
