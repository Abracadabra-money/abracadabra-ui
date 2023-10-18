import type { PublicClient } from "viem";
import { FEE_PERCENT_ABI } from "@/constants/abi";
import type { CauldronConfig } from "@/utils/cauldronsConfig/configTypes";

export const getFeePercentViem = async (
  config: CauldronConfig,
  publicClient: PublicClient,
  chainId: number
): Promise<bigint | unknown> => {
  if (chainId !== 42161 && config.id !== 2) return 0n;

  return await publicClient.readContract({
    address: config.collateralInfo.address,
    abi: FEE_PERCENT_ABI,
    functionName: "feePercent",
    args: [],
  });
};
