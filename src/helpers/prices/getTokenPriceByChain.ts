import { formatUnits } from "viem";
import type { Address } from "viem";
import chainLinkAbi from "@/abis/chainLink";
import { getPublicClient } from "@/helpers/chains/getChainsInfo";

export const getTokenPriceByChain = async (
  chainId: number,
  address: Address
) => {
  try {
    const publicClient = getPublicClient(chainId);

    const response: any = await publicClient.readContract({
      address,
      abi: chainLinkAbi,
      functionName: "latestAnswer",
    });

    return +formatUnits(response, 8);
  } catch (error) {
    console.log("getTokenPriceByChain error", chainId);
    return 0;
  }
};
