import {
  writeContractHelper,
  simulateContractHelper,
  waitForTransactionReceiptHelper,
} from "@/helpers/walletClienHelper";
import type { ContractInfo } from "@/types/global";
import { notificationErrorMsg } from "@/helpers/notification/notificationError.js";

export const claim = async (contract: ContractInfo, lock: boolean) => {
  try {
    const { request } = await simulateContractHelper({
      ...contract,
      functionName: "claim",
      args: [lock],
    });

    const hash = await writeContractHelper(request);

    return await waitForTransactionReceiptHelper({ hash });
  } catch (error) {
    console.log("Claim Handler Error:", error);
    return {
      error: { type: "error", msg: notificationErrorMsg(error) },
    };
  }
};
