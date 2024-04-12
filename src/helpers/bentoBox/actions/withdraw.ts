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
  tokenAddress: string,
  account: Address,
  amount: bigint
) => {
  try {
    const { request } = await simulateContractHelper({
      ...contract,
      functionName: "withdraw",
      args: [tokenAddress, account, account, amount, "0"],
    });

    const hash = await writeContractHelper(request);

    return await waitForTransactionReceiptHelper({ hash });
  } catch (error) {
    console.log("Bento withdraw error:", error);
    return {
      error: { type: "error", msg: await notificationErrorMsg(error) },
    };
  }
};
