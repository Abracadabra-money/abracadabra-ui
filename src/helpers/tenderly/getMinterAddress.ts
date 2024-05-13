import type { Address } from "viem";
import mimERC20Abi from "@/abis/tokensAbi/mimERC20Abi";
import anySwapERC20Abi from "@/abis/tokensAbi/anySwapERC20Abi";
import { getPublicClient } from "@/helpers/chains/getChainsInfo";

export const getMinterAddress = async (
  tokenAddress: Address,
  chainId: number
): Promise<Address> => {
  const publicClient = getPublicClient(chainId);

  const minters = await publicClient.readContract({
    address: tokenAddress,
    abi: chainId === 1 ? mimERC20Abi : anySwapERC20Abi,
    functionName: chainId === 1 ? "owner" : "getAllMinters",
  });

  return Array.isArray(minters) ? minters[0] : minters;
};
