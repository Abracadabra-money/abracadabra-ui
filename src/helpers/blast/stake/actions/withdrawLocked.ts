import {
  writeContractHelper,
  simulateContractHelper,
  waitForTransactionReceiptHelper,
} from "@/helpers/walletClienHelper";
import type { Address } from "viem";
import type { ContractInfo } from "@/types/global";
import { notificationErrorMsg } from "@/helpers/notification/notificationError.js";

export const withdrawLocked = async (
  contract: ContractInfo,
  tokenAddress: Address,
  amount: bigint
) => {
  try {
    const { request } = await simulateContractHelper({
      ...contract,
      functionName: "withdrawLocked",
      args: [tokenAddress, amount],
    });

    const hash = await writeContractHelper(request);

    return await waitForTransactionReceiptHelper({ hash });
  } catch (error) {
    console.log("Withdraw Locked Handler Error:", error);
    return {
      error: { type: "error", msg: await notificationErrorMsg(error) },
    };
  }
};
