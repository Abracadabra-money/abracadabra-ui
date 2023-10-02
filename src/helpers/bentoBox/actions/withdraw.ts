import type { ContractInfo } from "@/types/global";
import { waitForTransaction, type Address } from "@wagmi/core";
import { prepareWriteContract, writeContract } from "@wagmi/core";
import { notificationErrorMsg } from "@/helpers/notification/notificationError.js";

export const withdraw = async (
  contract: ContractInfo,
  tokenAddress: string,
  account: Address,
  amount: bigint
) => {
  try {
    const config = await prepareWriteContract({
      ...contract,
      functionName: "withdraw",
      args: [tokenAddress, account, account, amount, "0"],
    });

    const { hash } = await writeContract(config);

    return await waitForTransaction({ hash });
  } catch (error) {
    console.log("Bento withdraw error:", error);
    return {
      error: { type: "error", msg: await notificationErrorMsg(error) },
    };
  }
};
