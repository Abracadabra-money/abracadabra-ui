import {
  writeContractHelper,
  simulateContractHelper,
  waitForTransactionReceiptHelper,
} from "@/helpers/walletClienHelper";
import type { ContractInfo } from "@/types/global";
import { notificationErrorMsg } from "@/helpers/notification/notificationError.js";

import BlastOnboardProxyAbi from "@/abis/BlastOnboardProxy";

export const claim = async (contract: ContractInfo, lock: boolean) => {
  console.log("Claim Handler:", contract, lock);
  const { request } = await simulateContractHelper({
    address: contract.address,
    abi: BlastOnboardProxyAbi,
    functionName: "claim",
    args: [lock],
  });

  const hash = await writeContractHelper(request);

  return await waitForTransactionReceiptHelper({ hash });
};
