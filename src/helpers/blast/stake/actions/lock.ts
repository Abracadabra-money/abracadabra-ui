import type { ContractInfo } from "@/types/global";
import { waitForTransaction, type Address } from "@wagmi/core";
import { prepareWriteContract, writeContract } from "@wagmi/core";
import { notificationErrorMsg } from "@/helpers/notification/notificationError.js";

export const lock = async (
  contract: ContractInfo,
  tokenAddress: Address,
  amount: bigint
) => {
  try {
    const config = await prepareWriteContract({
      ...contract,
      functionName: "lock",
      args: [tokenAddress, amount],
    });

    const { hash } = await writeContract(config);
    return await waitForTransaction({ hash });
  } catch (error) {
    console.log("Lock Handler Error:", error);
    return {
      error: { type: "error", msg: await notificationErrorMsg(error) },
    };
  }
};
