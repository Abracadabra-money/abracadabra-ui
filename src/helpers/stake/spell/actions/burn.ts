import { waitForTransaction } from "@wagmi/core";
import { prepareWriteContract, writeContract } from "@wagmi/core";
import { notificationErrorMsg } from "@/helpers/notification/notificationError.js";

export const burn = async (contract: any, account: string, amount: any) => {
  try {
    const config = await prepareWriteContract({
      ...contract,
      functionName: "burn",
      args: [account, amount],
    });

    const { hash } = await writeContract(config);

    return await waitForTransaction({ hash });
  } catch (error) {
    console.log("Stake Burn Handler Error:", error);
    return {
      error: { type: "error", msg: await notificationErrorMsg(error) },
    };
  }
};
