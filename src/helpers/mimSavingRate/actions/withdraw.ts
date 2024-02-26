import { waitForTransaction } from "@wagmi/core";
import type { ContractInfo } from "@/types/global";
import { prepareWriteContract, writeContract } from "@wagmi/core";
import { notificationErrorMsg } from "@/helpers/notification/notificationError.js";

export const withdraw = async (
  contract: ContractInfo,
  { withdrawAmount }: any
) => {
  try {
    const prepareResponse = await prepareWriteContract({
      ...contract,
      functionName: "withdraw",
      args: [withdrawAmount],
    });

    const { hash } = await writeContract(prepareResponse);

    return await waitForTransaction({ hash });
  } catch (error) {
    console.log("Withdraw Handler Error:", error);

    return {
      error: { type: "error", msg: await notificationErrorMsg(error) },
    };
  }
};
