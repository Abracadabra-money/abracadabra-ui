import type { ContractInfo } from "@/types/global";
import type { Address } from "viem";
import {
  prepareWriteContract,
  writeContract,
  waitForTransaction,
} from "@wagmi/core";
import { notificationErrorMsg } from "@/helpers/notification/notificationError.js";

export const withdrawLocked = async (
  contract: ContractInfo,
  tokenAddress: Address,
  amount: bigint
) => {
  try {
    const config = await prepareWriteContract({
      ...contract,
      functionName: "withdrawLocked",
      args: [tokenAddress, amount],
    });

    const { hash } = await writeContract(config);
    return await waitForTransaction({ hash });
  } catch (error) {
    console.log("Withdraw Locked Handler Error:", error);
    return {
      error: { type: "error", msg: await notificationErrorMsg(error) },
    };
  }
};
