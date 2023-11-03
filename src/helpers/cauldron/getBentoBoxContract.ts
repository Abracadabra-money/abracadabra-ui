import bentoBoxAbi from "@/utils/abi/bentoBox";
import { Contract, type providers } from "ethers";
import cauldronAbi from "@/utils/abi/cauldronAbi";
import { readContract, type Address } from "@wagmi/core";

export const getBentoBoxContract = async (
  cauldronAddress: Address,
  provider: providers.BaseProvider
): Promise<Contract | null> => {
  const bentoBoxAddress: any = await readContract({
    address: cauldronAddress,
    abi: cauldronAbi,
    functionName: "bentoBox",
  });

  if (!bentoBoxAddress) return null;
  return await new Contract(bentoBoxAddress, bentoBoxAbi, provider);
};
