import {
  writeContractHelper,
  simulateContractHelper,
  waitForTransactionReceiptHelper,
} from "@/helpers/walletClienHelper";
import type { ContractInfo } from "@/types/global";
import { notificationErrorMsg } from "@/helpers/notification/notificationError.js";

export const deposit = async (contract: ContractInfo, amount: bigint) => {
  try {
    const { request } = await simulateContractHelper({
      ...contract,
      functionName: "deposit",
      args: [amount],
    });

    const hash = await writeContractHelper(request);

    return await waitForTransactionReceiptHelper({ hash });
  } catch (error) {
    console.log("Stake Deposit Handler Error:", error);
    return {
      error: { type: "error", msg: await notificationErrorMsg(error) },
    };
  }
};
