import { waitForTransaction } from "@wagmi/core";
import type { ContractInfo } from "@/types/global";
import { prepareWriteContract, writeContract } from "@wagmi/core";
import { notificationErrorMsg } from "@/helpers/notification/notificationError.js";

export const getRewards = async (contract: ContractInfo) => {
  try {
    const prepareResponse = await prepareWriteContract({
      ...contract,
      functionName: "getRewards",
      args: [],
    });

    const { hash } = await writeContract(prepareResponse);

    return await waitForTransaction({ hash });
  } catch (error) {
    console.log("Get Rewards Handler Error:", error);

    return {
      error: { type: "error", msg: await notificationErrorMsg(error) },
    };
  }
};
