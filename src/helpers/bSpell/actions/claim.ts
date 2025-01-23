import {
  writeContractHelper,
  simulateContractHelper,
  waitForTransactionReceiptHelper,
} from "@/helpers/walletClienHelper";
import type { ContractInfo } from "@/types/global";

export const claim = async (contract: ContractInfo) => {
  const { request } = await simulateContractHelper({
    ...contract,
    functionName: "claim",
    args: [],
  });

  const hash = await writeContractHelper(request);

  return await waitForTransactionReceiptHelper({ hash });
};
