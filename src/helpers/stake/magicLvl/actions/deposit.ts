import { notificationErrorMsg } from "@/helpers/notification/notificationError.js";
import type { Contract, BigNumber } from "ethers";

export const deposit = async (
  contract: Contract,
  amount: BigNumber,
  account: string
) => {
  try {
    const estimateGas = await contract.estimateGas.deposit(amount, account);
    const gasLimit = 1000 + +estimateGas.toString();
    const tx = await contract.deposit(amount, account, { gasLimit });
    const result = await tx.wait();
    return { result };
  } catch (error) {
    console.log("Stake Deposit Handler Error:", error);

    return {
      error: { type: "error", msg: await notificationErrorMsg(error) },
    };
  }
};
