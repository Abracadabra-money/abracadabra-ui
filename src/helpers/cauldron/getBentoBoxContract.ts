import type { Address } from "viem";
import bentoBoxAbi from "@/abis/bentoBox";
import cauldronAbi from "@/abis/cauldronAbi";
import { Contract, type providers } from "ethers";
import { getPublicClient } from "@/helpers/chains/getChainsInfo";

export const getBentoBoxContract = async (
  cauldronAddress: Address,
  provider: providers.BaseProvider,
  chainId: number
): Promise<Contract | null> => {
  const publicClient = getPublicClient(chainId);

  const bentoBoxAddress: any = await publicClient.readContract({
    address: cauldronAddress,
    abi: cauldronAbi,
    functionName: "bentoBox",
  });

  if (!bentoBoxAddress) return null;
  return await new Contract(bentoBoxAddress, bentoBoxAbi, provider);
};
