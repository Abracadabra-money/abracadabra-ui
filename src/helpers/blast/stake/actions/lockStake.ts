import {
  writeContractHelper,
  simulateContractHelper,
  waitForTransactionReceiptHelper,
} from "@/helpers/walletClienHelper";
import type { ContractInfo } from "@/types/global";
import { notificationErrorMsg } from "@/helpers/notification/notificationError.js";

export const lockStake = async (
  contract: ContractInfo,
  amount: bigint,
  deadline: number
) => {
  try {
    const { request } = await simulateContractHelper({
      ...contract,
      functionName: "lock",
      args: [amount, deadline],
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
