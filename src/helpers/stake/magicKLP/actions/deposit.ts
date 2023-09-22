import type { Address } from "@wagmi/core";
import { waitForTransaction } from "@wagmi/core";
import type { ContractInfo } from "@/types/global";
import { prepareWriteContract, writeContract } from "@wagmi/core";
import { notificationErrorMsg } from "@/helpers/notification/notificationError.js";

export const deposit = async (
  contract: ContractInfo,
  amount: BigInt,
  account: Address
) => {
  try {
    const config = await prepareWriteContract({
      ...contract,
      functionName: "deposit",
      args: [amount, account],
    });

    const { hash } = await writeContract(config);

    return await waitForTransaction({ hash });
  } catch (error) {
    console.log("Stake Deposit Handler Error:", error);

    return {
      error: { type: "error", msg: await notificationErrorMsg(error, "mklp") },
    };
  }
};
