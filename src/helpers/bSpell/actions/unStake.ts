import {
  writeContractHelper,
  simulateContractHelper,
  waitForTransactionReceiptHelper,
} from "@/helpers/walletClienHelper";
import type { ContractInfo } from "@/types/global";

export const unStake = async (contract: ContractInfo, amount: bigint) => {
  const { request } = await simulateContractHelper({
    ...contract,
    functionName: "withdraw",
    args: [amount],
  });

  const hash = await writeContractHelper(request);

  return await waitForTransactionReceiptHelper({ hash });
};
