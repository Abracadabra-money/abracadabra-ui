import {
  writeContractHelper,
  simulateContractHelper,
  waitForTransactionReceiptHelper,
} from "@/helpers/walletClienHelper";
import type { ContractInfo } from "@/types/global";
import { notificationErrorMsg } from "@/helpers/notification/notificationError.js";

export const withdrawWithRewards = async (
  contract: ContractInfo,
  amount: BigInt
) => {
  try {
    const { request } = await simulateContractHelper({
      ...contract,
      functionName: "withdrawWithRewards",
      args: [amount],
    });

    const hash = await writeContractHelper(request);

    return await waitForTransactionReceiptHelper({ hash });
  } catch (error) {
    console.log("Withdraw With Rewards Handler Error:", error);

    return {
      error: { type: "error", msg: await notificationErrorMsg(error) },
    };
  }
};
