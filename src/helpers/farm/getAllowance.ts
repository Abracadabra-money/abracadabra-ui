import type { Contract } from "ethers";
import { getAccount } from "@wagmi/core";

export const getAllowance = async (
  contractInstance: Contract,
  allowAddrr: string
): Promise<Boolean | undefined> => {
  try {
    const account = await getAccount().address;
    const result = await contractInstance.allowance(account, allowAddrr);

    return +result > 0;
  } catch (error) {
    console.log("getAllowance:", error);
  }
};
