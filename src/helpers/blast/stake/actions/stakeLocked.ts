import type { ContractInfo } from "@/types/global";
import {
  prepareWriteContract,
  writeContract,
  waitForTransaction,
} from "@wagmi/core";
import { notificationErrorMsg } from "@/helpers/notification/notificationError.js";

export const stake = async (
  contract: ContractInfo,
  amount: bigint,
  isLock: boolean
) => {
  try {
    const config = await prepareWriteContract({
      ...contract,
      functionName: "stake",
      args: [amount, isLock],
    });

    const { hash } = await writeContract(config);
    return await waitForTransaction({ hash });
  } catch (error) {
    console.log("Deposit Handler Error:", error);
    return {
      error: { type: "error", msg: await notificationErrorMsg(error) },
    };
  }
};
