import { prepareWriteContract, writeContract } from "@wagmi/core";
import { waitForTransaction } from "@wagmi/core";
import { notificationErrorMsg } from "@/helpers/notification/notificationError.js";
import type { ContractInfo } from "@/types/global";

export const withdraw = async (contract: ContractInfo, amount: bigint) => {
  try {
    const config = await prepareWriteContract({
      ...contract,
      functionName: "withdraw",
      args: [amount],
    });

    const { hash } = await writeContract(config);

    return await waitForTransaction({ hash });
  } catch (error) {
    console.log("Stake Withdraw Handler Error:", error);
    return {
      error: { type: "error", msg: await notificationErrorMsg(error) },
    };
  }
};
