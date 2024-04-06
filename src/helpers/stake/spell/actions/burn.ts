import {
  writeContractHelper,
  simulateContractHelper,
  waitForTransactionReceiptHelper,
} from "@/helpers/walletClienHelper";
import { notificationErrorMsg } from "@/helpers/notification/notificationError.js";

export const burn = async (contract: any, account: string, amount: any) => {
  try {
    const { request } = await simulateContractHelper({
      ...contract,
      functionName: "burn",
      args: [account, amount],
    });

    const hash = await writeContractHelper(request);

    return await waitForTransactionReceiptHelper({ hash });
  } catch (error) {
    console.log("Stake Burn Handler Error:", error);
    return {
      error: { type: "error", msg: await notificationErrorMsg(error) },
    };
  }
};
