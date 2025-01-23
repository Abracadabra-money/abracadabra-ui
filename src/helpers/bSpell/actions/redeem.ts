import {
  writeContractHelper,
  simulateContractHelper,
  waitForTransactionReceiptHelper,
} from "@/helpers/walletClienHelper";
import moment from "moment";
import type { Address } from "viem";
import type { ContractInfo } from "@/types/global";

export const redeem = async (
  contract: ContractInfo,
  amount: BigInt,
  account: Address,
  lockingDeadline: bigint
) => {
  const deadline = moment().unix() + Number(lockingDeadline);

  const { request } = await simulateContractHelper({
    ...contract,
    functionName: "redeem",
    args: [amount, account, deadline],
  });

  const hash = await writeContractHelper(request);

  return await waitForTransactionReceiptHelper({ hash });
};
