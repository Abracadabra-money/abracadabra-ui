import type { Contract, BigNumber } from "ethers";
import { notificationErrorMsg } from "@/helpers/notification/notificationError.js";

export const burn = async (
  contract: Contract,
  account: string,
  amount: BigNumber
) => {
  try {
    const estimateGas = await contract.estimateGas.burn(account, amount);
    const gasLimit = 1000 + +estimateGas.toString();
    const tx = await contract.burn(account, amount, { gasLimit });
    const result = await tx.wait();
    return { result };
  } catch (error) {
    console.log("Stake Burn Handler Error:", error);
    return {
      error: { type: "error", msg: await notificationErrorMsg(error) },
    };
  }
};
