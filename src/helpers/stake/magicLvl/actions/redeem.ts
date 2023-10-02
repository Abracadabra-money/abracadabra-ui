import type { ContractInfo } from "@/types/global";
import { waitForTransaction, type Address } from "@wagmi/core";
import { prepareWriteContract, writeContract } from "@wagmi/core";
import { notificationErrorMsg } from "@/helpers/notification/notificationError.js";

export const redeem = async (
  contract: ContractInfo,
  amount: bigint,
  account: Address
) => {
  try {
    const config = await prepareWriteContract({
      ...contract,
      functionName: "redeem",
      args: [amount, account, account],
    });

    const { hash } = await writeContract(config);
    return await waitForTransaction({ hash });
  } catch (error) {
    console.log("Magic LVL Stake Redeem Handler Error:", error);
    return {
      error: { type: "error", msg: await notificationErrorMsg(error) },
    };
  }
};
