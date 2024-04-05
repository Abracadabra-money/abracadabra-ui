import {
  prepareWriteContract,
  writeContract,
  waitForTransaction,
} from "@wagmi/core";
import { notificationErrorMsg } from "@/helpers/notification/notificationError.js";

export const mint = async (contract: any, amount: any) => {
  try {
    const config = await prepareWriteContract({
      ...contract,
      functionName: "mint",
      args: [amount],
    });

    const { hash } = await writeContract(config);

    return await waitForTransaction({ hash });
  } catch (error) {
    console.log("Stake Mint Handler Error:", error);
    return {
      error: { type: "error", msg: await notificationErrorMsg(error) },
    };
  }
};
