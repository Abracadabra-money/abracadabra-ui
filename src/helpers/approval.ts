import {
  prepareWriteContract,
  waitForTransaction,
  writeContract,
} from "@wagmi/core";
import type { Contract } from "ethers";
import type { Address } from "@wagmi/core";
import type { ContractInfo } from "@/types/global";
import { MAX_APPROVAL_AMOUNT } from "@/constants/global";

const APPROVE_AMOUNT: string =
  "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";
const APPROVE_GAS_LIMIT: number = 1000;

export const approveToken = async (
  contract: Contract,
  spender: string
): Promise<Boolean> => {
  try {
    const estimateGas = await contract.estimateGas.approve(
      spender,
      APPROVE_AMOUNT
    );

    const gasLimit = APPROVE_GAS_LIMIT + +estimateGas.toString();

    const tx = await contract.approve(spender, APPROVE_AMOUNT, {
      gasLimit,
    });

    await tx.wait();
    return true;
  } catch (error) {
    console.log("Approve Token:", error);
    return false;
  }
};

export const approveTokenViem = async (
  contract: ContractInfo,
  spender: Address
) => {
  try {
    const config = await prepareWriteContract({
      ...contract,
      functionName: "approve",
      args: [spender, MAX_APPROVAL_AMOUNT],
    });

    const { hash } = await writeContract(config);
    await waitForTransaction({ hash });

    return true;
  } catch (error) {
    console.log("Approve Token:", error);
    return false;
  }
};
