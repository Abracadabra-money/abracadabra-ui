import {
  writeContractHelper,
  simulateContractHelper,
  waitForTransactionReceiptHelper,
} from "@/helpers/walletClienHelper";
import type { ContractInfo } from "@/types/global";
// @ts-ignore
import { notificationErrorMsg } from "@/helpers/notification/notificationError";

export const claim = async (contract: ContractInfo) => {
  try {
    const { request } = await simulateContractHelper({
      ...contract,
      functionName: "claim",
      args: [],
    });

    const hash = await writeContractHelper(request);

    return await waitForTransactionReceiptHelper({ hash });
  } catch (error) {
    console.log("Claim Spell Handler Error:", error);
    return {
      error: { type: "error", msg: await notificationErrorMsg(error) },
    };
  }
};
