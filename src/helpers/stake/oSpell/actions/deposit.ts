import {
  writeContractHelper,
  simulateContractHelper,
  waitForTransactionReceiptHelper,
} from "@/helpers/walletClienHelper";
import type { ContractInfo } from "@/types/global";
import { notificationErrorMsg } from "@/helpers/notification/notificationError.js";

export const deposit = async (
  contract: ContractInfo,
  amount: bigint,
  lockingDeadline: bigint
) => {
  try {
    const { request } = await simulateContractHelper({
      ...contract,
      functionName: "deposit",
      args: [amount, lockingDeadline],
    });

    const hash = await writeContractHelper(request);

    return await waitForTransactionReceiptHelper({ hash });
  } catch (error) {
    console.log("Create Lock Handler Error:", error);
    return {
      error: { type: "error", msg: await notificationErrorMsg(error) },
    };
  }
};
