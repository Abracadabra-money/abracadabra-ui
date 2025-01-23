import {
  writeContractHelper,
  simulateContractHelper,
  waitForTransactionReceiptHelper,
} from "@/helpers/walletClienHelper";
import type { Address } from "viem";
import type { ContractInfo } from "@/types/global";

export const instantRedeem = async (
  contract: ContractInfo,
  amount: BigInt,
  account: Address
) => {
  const { request } = await simulateContractHelper({
    ...contract,
    functionName: "instantRedeem",
    args: [amount, account],
  });

  const hash = await writeContractHelper(request);

  return await waitForTransactionReceiptHelper({ hash });
};
