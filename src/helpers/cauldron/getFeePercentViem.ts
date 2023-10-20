import type { PublicClient } from "viem";
import type { CauldronConfig } from "@/utils/cauldronsConfig/configTypes";

export const getFeePercentViem = async (
  config: CauldronConfig,
  publicClient: PublicClient,
  chainId: number
): Promise<bigint | unknown> => {
  if (chainId !== 42161 && config.id !== 2) return 0n;

  return await publicClient.readContract({
    address: config.collateralInfo.address,
    abi: [
      {
        inputs: [],
        name: "feePercent",
        outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
        stateMutability: "view",
        type: "function",
      },
    ],
    functionName: "feePercent",
    args: [],
  });
};
