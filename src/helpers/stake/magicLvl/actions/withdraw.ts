import {
  writeContractHelper,
  simulateContractHelper,
  waitForTransactionReceiptHelper,
} from "@/helpers/walletClienHelper";
import type { Address } from "viem";
import type { ContractInfo } from "@/types/global";
import { notificationErrorMsg } from "@/helpers/notification/notificationError.js";

export const withdraw = async (
  contract: ContractInfo,
  withdrawAmount: bigint,
  account: Address,
  pid: number,
  chainId = 56
) => {
  try {
    const { request } = await simulateContractHelper({
      ...contract,
      functionName: "withdraw",
      args: [pid, withdrawAmount, account],
    });

    const hash = await writeContractHelper(request);

    return await waitForTransactionReceiptHelper({ chainId, hash });
  } catch (error) {
    console.log("Magic LVL Stake Withdraw Error:", error);
    return {
      error: { type: "error", msg: await notificationErrorMsg(error) },
    };
  }
};
