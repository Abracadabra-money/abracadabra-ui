import {
  writeContractHelper,
  simulateContractHelper,
  waitForTransactionReceiptHelper,
} from "@/helpers/walletClienHelper";
import { notificationErrorMsg } from "@/helpers/notification/notificationError.js";

export const mint = async (contract: any, amount: any) => {
  try {
    const { request } = await simulateContractHelper({
      ...contract,
      functionName: "mint",
      args: [amount],
    });

    const hash = await writeContractHelper(request);

    return await waitForTransactionReceiptHelper({ hash });
  } catch (error) {
    console.log("Stake Mint Handler Error:", error);
    return {
      error: { type: "error", msg: await notificationErrorMsg(error) },
    };
  }
};
