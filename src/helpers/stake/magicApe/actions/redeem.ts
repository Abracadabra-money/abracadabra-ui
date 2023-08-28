import { notificationErrorMsg } from "@/helpers/notification/notificationError.js";
import type { Contract, BigNumber } from "ethers";

export const redeem = async (
  contract: Contract,
  amount: BigNumber,
  account: string
) => {
  try {
    const estimateGas = await contract.estimateGas.redeem(
      amount,
      account,
      account
    );

    const gasLimit = 1000 + +estimateGas.toString();

    const tx = await contract.redeem(amount, account, account, {
      gasLimit,
    });

    const result = await tx.wait();
    return { result };
  } catch (error) {
    console.log("Stake Redeem Handler Error:", error);

    return {
      error: { type: "error", msg: await notificationErrorMsg(error) },
    };
  }
};
