import { readContract } from "@wagmi/core";
import { erc20Abi, type Address } from "viem";

export const getTokenDecimals = async (tokenAddress: Address) => {
  return await readContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: "decimals",
  });
};
