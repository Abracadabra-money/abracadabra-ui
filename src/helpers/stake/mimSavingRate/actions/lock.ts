import { waitForTransaction } from "@wagmi/core";
import type { ContractInfo } from "@/types/global";
import { prepareWriteContract, writeContract } from "@wagmi/core";
import { notificationErrorMsg } from "@/helpers/notification/notificationError.js";

export const lock = async (contract: ContractInfo, amount: BigInt) => {
  try {
    const prepareResponse = await prepareWriteContract({
      ...contract,
      functionName: "lock",
      args: [amount],
    });

    const { hash } = await writeContract(prepareResponse);

    return await waitForTransaction({ hash });
  } catch (error) {
    console.log("Lock Handler Error:", error);

    return {
      error: { type: "error", msg: await notificationErrorMsg(error) },
    };
  }
};
