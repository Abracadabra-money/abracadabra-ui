import {
    writeContractHelper,
    simulateContractHelper,
    waitForTransactionReceiptHelper,
} from "@/helpers/walletClienHelper";
import type { ContractInfo } from "@/types/global";
import { notificationErrorMsg } from "@/helpers/notification/notificationError.js";

export const stakeLocked = async (contract: ContractInfo, amount: bigint, lockingDeadline: bigint | number) => {
    try {
        const { request } = await simulateContractHelper({
            ...contract,
            functionName: "stakeLocked",
            args: [amount, lockingDeadline],
        });

        const hash = await writeContractHelper(request);

        return await waitForTransactionReceiptHelper({ hash });
    } catch (error) {
        console.log("Lock Handler Error:", error);

        return {
            error: { type: "error", msg: await notificationErrorMsg(error) },
        };
    }
};
