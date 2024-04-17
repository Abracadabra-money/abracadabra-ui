import bentoBoxAbi from "@/abis/bentoBox";
import { getPublicClient } from "@/helpers/chains/getChainsInfo";
import type { Address } from "viem";

export const getBentoBoxContract = async (
  chainId: number,
  address: Address | string,
  abi: any
) => {
  const publicClient = getPublicClient(chainId);

  const bentoBoxAddress = await publicClient.readContract({
    address: address,
    abi: abi,
    functionName: "bentoBox",
    args: [],
  });

  return {
    address: bentoBoxAddress,
    abi: bentoBoxAbi,
  };
};
