import type { ContractInfo } from "@/types/global";
import type { Address } from "viem";
import {
  prepareWriteContract,
  writeContract,
  waitForTransaction,
} from "@wagmi/core";
import { notificationErrorMsg } from "@/helpers/notification/notificationError.js";

export const withdraw = async (
  contract: ContractInfo,
  withdrawAmount: bigint,
  account: Address,
  pid: number,
  chainId = 56
) => {
  try {
    const config = await prepareWriteContract({
      ...contract,
      functionName: "withdraw",
      args: [pid, withdrawAmount, account],
    });

    const { hash } = await writeContract(config);

    const data = await waitForTransaction({ chainId, hash });
    return data;
  } catch (error) {
    console.log("Magic LVL Stake Withdraw Error:", error);
    return {
      error: { type: "error", msg: await notificationErrorMsg(error) },
    };
  }
};
