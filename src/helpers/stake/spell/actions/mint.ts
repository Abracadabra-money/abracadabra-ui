import type { Contract, BigNumber } from "ethers";
import { notificationErrorMsg } from "@/helpers/notification/notificationError.js";

export const mint = async (contract: Contract, amount: BigNumber) => {
  try {
    const estimateGas = await contract.estimateGas.mint(amount);
    const gasLimit = 1000 + +estimateGas.toString();
    const tx = await contract.mint(amount, { gasLimit });
    const result = await tx.wait();
    return { result };
  } catch (error) {
    console.log("Stake Mint Handler Error:", error);
    return {
      error: { type: "error", msg: await notificationErrorMsg(error) },
    };
  }
};
