import { chainsList } from "@/helpers/chains";
import chainLinkAbi from "@/abis/chainLink";
import { createPublicClient, formatUnits, http, type Address } from "viem";

export const getTokenPriceByChain = async (
  chainId: number,
  address: Address
) => {
  const chain = chainsList[chainId as keyof typeof chainsList];

  const publicClient = createPublicClient({
    chain: chain,
    transport: http(),
  });

  const response: any = await publicClient.readContract({
    address,
    abi: chainLinkAbi,
    functionName: "latestAnswer",
  });

  return +formatUnits(response, 8);
};
