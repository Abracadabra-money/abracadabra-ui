import { utils } from "ethers";
import type { Contract } from "ethers";
import { getAccount } from "@wagmi/core";

export const getAllowance = async (
  contractInstance: Contract,
  allowAddrr: string
) => {
  try {
    const account = await getAccount().address;
    const result = await contractInstance.allowance(account, allowAddrr);

    return utils.formatUnits(result);
  } catch (error) {
    console.log("getAllowance:", error);
  }
};
