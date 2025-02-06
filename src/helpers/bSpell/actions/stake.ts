import {
  writeContractHelper,
  simulateContractHelper,
  waitForTransactionReceiptHelper,
} from "@/helpers/walletClienHelper";
import type { ContractInfo } from "@/types/global";

export const stake = async (contract: ContractInfo, amount: bigint) => {
  const { request } = await simulateContractHelper({
    ...contract,
    functionName: "stake",
    args: [amount],
  });

  const hash = await writeContractHelper(request);

  return await waitForTransactionReceiptHelper({ hash });
};
