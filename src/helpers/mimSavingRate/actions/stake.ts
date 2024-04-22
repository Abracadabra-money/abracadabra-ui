import {
  writeContractHelper,
  simulateContractHelper,
  waitForTransactionReceiptHelper,
} from "@/helpers/walletClienHelper";
import type { ContractInfo } from "@/types/global";
import { notificationErrorMsg } from "@/helpers/notification/notificationError.js";

export const stake = async (
  contract: ContractInfo,
  { stakeAmount }: any,
  isLock = false
) => {
  try {
    const { request } = await simulateContractHelper({
      ...contract,
      functionName: "stake",
      args: [stakeAmount, isLock],
    });

    const hash = await writeContractHelper(request);

    return await waitForTransactionReceiptHelper({ hash });
  } catch (error) {
    console.log("Stake Handler Error:", error);

    return {
      error: { type: "error", msg: await notificationErrorMsg(error) },
    };
  }
};
