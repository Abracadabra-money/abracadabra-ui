import { notificationErrorMsg } from "@/helpers/notification/notificationError.js";
import type { Contract, BigNumber } from "ethers";

export const withdraw = async (
  contract: Contract,
  withdrawAmount: BigNumber,
  account: string,
  pid: string
) => {
  try {
    const tx = await contract.withdraw(pid, withdrawAmount, account);
    const result = await tx.wait();
    return { result };
  } catch (error) {
    console.log("Stake Withdraw Error:", error);

    return {
      error: { type: "error", msg: await notificationErrorMsg(error) },
    };
  }
};
