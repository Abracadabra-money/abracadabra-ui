import type { Address } from "@wagmi/core";
import {
  prepareWriteContract,
  waitForTransaction,
  writeContract,
} from "@wagmi/core";
import type { ContractInfo } from "@/types/global";
import { notificationErrorMsg } from "@/helpers/notification/notificationError.js";

export const redeem = async (
  contract: ContractInfo,
  amount: BigInt,
  account: Address
) => {
  try {
    const config = await prepareWriteContract({
      ...contract,
      functionName: "redeem",
      args: [amount, account, account],
    });

    const { hash } = await writeContract(config);

    return await waitForTransaction({ hash });
  } catch (error) {
    console.log("Stake Redeem Handler Error:", error);

    return {
      error: { type: "error", msg: await notificationErrorMsg(error) },
    };
  }
};
