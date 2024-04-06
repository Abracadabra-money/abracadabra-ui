import {
  writeContractHelper,
  simulateContractHelper,
  waitForTransactionReceiptHelper,
} from "@/helpers/walletClienHelper";
import type { Address } from "viem";
import type { ContractInfo } from "@/types/global";
import { notificationErrorMsg } from "@/helpers/notification/notificationError.js";

export const redeem = async (
  contract: ContractInfo,
  amount: bigint,
  account: Address
) => {
  try {
    const { request } = await simulateContractHelper({
      ...contract,
      functionName: "redeem",
      args: [amount, account, account],
    });

    const hash = await writeContractHelper(request);

    return await waitForTransactionReceiptHelper({ hash });
  } catch (error) {
    console.log("Magic LVL Stake Redeem Handler Error:", error);
    return {
      error: { type: "error", msg: await notificationErrorMsg(error) },
    };
  }
};
