import {
  writeContractHelper,
  simulateContractHelper,
  waitForTransactionReceiptHelper,
} from "@/helpers/walletClienHelper";
import type { Address } from "viem";
import type { Contract } from "ethers";
import type { ContractInfo } from "@/types/global";
import { MAX_ALLOWANCE_VALUE } from "@/constants/global";

const APPROVE_GAS_LIMIT: number = 1000;

export const approveToken = async (
  contract: Contract,
  spender: string
): Promise<Boolean> => {
  try {
    const estimateGas = await contract.estimateGas.approve(
      spender,
      MAX_ALLOWANCE_VALUE
    );

    const gasLimit = APPROVE_GAS_LIMIT + +estimateGas.toString();

    const tx = await contract.approve(spender, MAX_ALLOWANCE_VALUE, {
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
    const { request } = await simulateContractHelper({
      ...contract,
      functionName: "approve",
      args: [spender, MAX_ALLOWANCE_VALUE],
    });

    const hash = await writeContractHelper(request);

    await waitForTransactionReceiptHelper({ hash });

    return true;
  } catch (error) {
    console.log("Approve Token:", error);
    return false;
  }
};
