import {
  writeContractHelper,
  simulateContractHelper,
  waitForTransactionReceiptHelper,
} from "@/helpers/walletClienHelper";
import { notificationErrorMsg } from "@/helpers/notification/notificationError.js";

export const withdraw = async (contract: any, amount: any) => {
  try {
    const { request } = await simulateContractHelper({
      ...contract,
      functionName: "withdraw",
      args: [amount],
    });

    const hash = await writeContractHelper(request);

    return await waitForTransactionReceiptHelper({ hash });
  } catch (error) {
    console.log("Stake Withdraw Handler Error:", error);
    return {
      error: { type: "error", msg: await notificationErrorMsg(error) },
    };
  }
};
