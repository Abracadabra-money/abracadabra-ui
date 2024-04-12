import { waitForTransaction } from "@wagmi/core";
import BlastMIMSwapRouterAbi from "@/abis/BlastMIMSwapRouter";
import { prepareWriteContract, writeContract } from "@wagmi/core";
import type { Address } from "viem";

export const addLiquidityImbalanced = async (
    swapRouterAddress: Address,
    payload: any
) => {

    const config = await prepareWriteContract({
        address: swapRouterAddress,
        abi: BlastMIMSwapRouterAbi,
        functionName: "addLiquidityImbalanced",
        args: [payload],
    });

    const { hash } = await writeContract(config);
    return await waitForTransaction({ hash });
};
