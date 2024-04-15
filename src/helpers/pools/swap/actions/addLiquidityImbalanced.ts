import {
    writeContractHelper,
    simulateContractHelper,
    waitForTransactionReceiptHelper,
} from "@/helpers/walletClienHelper";
import type { Address } from "viem";
import BlastMIMSwapRouterAbi from "@/abis/BlastMIMSwapRouter";

export const addLiquidityImbalanced = async (
    swapRouterAddress: Address,
    payload: any
) => {

    const { request } = await simulateContractHelper({
        address: swapRouterAddress,
        abi: BlastMIMSwapRouterAbi,
        functionName: "addLiquidityImbalanced",
        args: [payload],
    });

    const hash = await writeContractHelper(request);
    return await waitForTransactionReceiptHelper({ hash });
};
