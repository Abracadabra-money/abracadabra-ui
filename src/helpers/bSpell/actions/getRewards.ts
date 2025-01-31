import {
  writeContractHelper,
  simulateContractHelper,
  waitForTransactionReceiptHelper,
} from "@/helpers/walletClienHelper";
import type { ContractInfo } from "@/configs/farms/types";

export const getRewards = async (contract: ContractInfo) => {
  const { request } = await simulateContractHelper({
    ...contract,
    functionName: "getRewards",
    args: [],
  });

  const hash = await writeContractHelper(request);

  return await waitForTransactionReceiptHelper({ hash });
};
