import type { Address } from "viem";
import { readContract } from "@wagmi/core";
import mimERC20Abi from "@/utils/abi/tokensAbi/mimERC20Abi";
import anySwapERC20Abi from "@/utils/abi/tokensAbi/anySwapERC20Abi";

export const getMinterAddress = async (
  tokenAddress: Address,
  chainId: number
): Promise<Address> => {
  const minters = await readContract({
    address: tokenAddress,
    abi: chainId === 1 ? mimERC20Abi : anySwapERC20Abi,
    functionName: chainId === 1 ? "owner" : "getAllMinters",
  });

  return Array.isArray(minters) ? minters[0] : minters;
};
