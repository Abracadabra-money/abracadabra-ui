import { waitForTransaction } from "@wagmi/core";
import type { ContractInfo } from "@/types/global";
import { prepareWriteContract, writeContract } from "@wagmi/core";
import { notificationErrorMsg } from "@/helpers/notification/notificationError.js";

export const stake = async (
  contract: ContractInfo,
  amount: BigInt,
  isLock: false
) => {
  try {
    const prepareResponse = await prepareWriteContract({
      ...contract,
      functionName: "stake",
      args: [amount, isLock],
    });

    const { hash } = await writeContract(prepareResponse);

    return await waitForTransaction({ hash });
  } catch (error) {
    console.log("Stake Handler Error:", error);

    return {
      error: { type: "error", msg: await notificationErrorMsg(error) },
    };
  }
};
