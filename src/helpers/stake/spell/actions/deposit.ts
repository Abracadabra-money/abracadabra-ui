import { waitForTransaction } from "@wagmi/core";
import { prepareWriteContract, writeContract } from "@wagmi/core";
import { notificationErrorMsg } from "@/helpers/notification/notificationError.js";

export const deposit = async (contract: any, amount: any) => {
  try {
    const config = await prepareWriteContract({
      ...contract,
      functionName: "deposit",
      args: [amount],
    });

    const { hash } = await writeContract(config);
    return await waitForTransaction({ hash });
  } catch (error) {
    console.log("Stake Deposit Handler Error:", error);
    return {
      error: { type: "error", msg: await notificationErrorMsg(error) },
    };
  }
};
