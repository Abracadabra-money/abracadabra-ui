import {
  writeContractHelper,
  simulateContractHelper,
  waitForTransactionReceiptHelper,
} from "@/helpers/walletClienHelper";
import type { Address } from "viem";
import type { ContractInfo } from "@/types/global";
import { MAX_ALLOWANCE_VALUE } from "@/constants/global";

export const approveToken = async (
  contract: ContractInfo,
  spender: Address,
  allowanceValue: bigint = MAX_ALLOWANCE_VALUE
) => {
  try {
    const { request } = await simulateContractHelper({
      ...contract,
      functionName: "approve",
      args: [spender, allowanceValue],
    });

    const hash = await writeContractHelper(request);

    await waitForTransactionReceiptHelper({
      hash,
    });

    return true;
  } catch (error) {
    console.log("Approve Token:", error);
    return false;
  }
};
