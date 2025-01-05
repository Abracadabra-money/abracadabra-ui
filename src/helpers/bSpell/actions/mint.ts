import {
  writeContractHelper,
  simulateContractHelper,
  waitForTransactionReceiptHelper,
} from "@/helpers/walletClienHelper";
import type { Address } from "viem";
import type { ContractInfo } from "@/types/global";

export const mint = async (
  contract: ContractInfo,
  amount: bigint,
  account: Address
) => {
  const { request } = await simulateContractHelper({
    ...contract,
    functionName: "mint",
    args: [amount, account],
  });

  const hash = await writeContractHelper(request);

  return await waitForTransactionReceiptHelper({ hash });
};
