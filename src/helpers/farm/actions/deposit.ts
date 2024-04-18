import {
  writeContractHelper,
  simulateContractHelper,
  waitForTransactionReceiptHelper,
} from "@/helpers/walletClienHelper";
import type { ContractInfo } from "@/configs/farms/types";

export const deposit = async (
  contractInfo: ContractInfo,
  poolId: number,
  amount: bigint
) => {
  try {
    const { request } = await simulateContractHelper({
      ...contractInfo,
      functionName: "deposit",
      args: [poolId, amount],
    });

    const hash = await writeContractHelper(request);

    return await waitForTransactionReceiptHelper({ hash });
  } catch (error) {
    console.log("Stake Redeem Handler Error:", error);
  }
};
