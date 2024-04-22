import {
  writeContractHelper,
  simulateContractHelper,
  waitForTransactionReceiptHelper,
} from "@/helpers/walletClienHelper";
import type { ContractInfo } from "@/types/global";
import { notificationErrorMsg } from "@/helpers/notification/notificationError.js";

export const getRewards = async (contract: ContractInfo) => {
  try {
    const { request } = await simulateContractHelper({
      ...contract,
      functionName: "getRewards",
      args: [],
    });

    const hash = await writeContractHelper(request);

    return await waitForTransactionReceiptHelper({ hash });
  } catch (error) {
    console.log("Get Rewards Handler Error:", error);

    return {
      error: { type: "error", msg: await notificationErrorMsg(error) },
    };
  }
};
