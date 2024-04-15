import {
  writeContractHelper,
  simulateContractHelper,
  waitForTransactionReceiptHelper,
} from "@/helpers/walletClienHelper";
import type { ContractInfo } from "@/configs/farms/types";

export const stake = async (contractInfo: ContractInfo, amount: bigint) => {
  try {
    const { request } = await simulateContractHelper({
      ...contractInfo,
      functionName: "stake",
      args: [amount],
    });

    const hash = await writeContractHelper(request);

    return await waitForTransactionReceiptHelper({ hash });
  } catch (error) {
    console.log("Stake Handler Error:", error);
  }
};
