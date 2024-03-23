import { waitForTransaction } from "@wagmi/core";
import type { ContractInfo } from "@/types/global";
import { prepareWriteContract, writeContract } from "@wagmi/core";
import { notificationErrorMsg } from "@/helpers/notification/notificationError.js";

export const claim = async (contract: ContractInfo, lock: boolean) => {
  try {
    const config = await prepareWriteContract({
      ...contract,
      functionName: "claim",
      args: [lock],
    });

    const { hash } = await writeContract(config);
    return await waitForTransaction({ hash });
  } catch (error) {
    console.log("Claim Handler Error:", error);
    return {
      error: { type: "error", msg: notificationErrorMsg(error) },
    };
  }
};
