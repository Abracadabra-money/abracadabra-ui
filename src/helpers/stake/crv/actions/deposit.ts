import type { Address } from "viem";
import {
  prepareWriteContract,
  writeContract,
  waitForTransaction,
} from "@wagmi/core";
import { notificationErrorMsg } from "@/helpers/notification/notificationError.js";
import type { ContractInfo } from "@/types/global";

export const deposit = async (
  contract: ContractInfo,
  amount: bigint,
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
      error: { type: "error", msg: await notificationErrorMsg(error) },
    };
  }
};
