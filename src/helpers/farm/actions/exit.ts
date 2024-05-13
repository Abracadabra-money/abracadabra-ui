import {
  writeContractHelper,
  simulateContractHelper,
  waitForTransactionReceiptHelper,
} from "@/helpers/walletClienHelper";
import type { ContractInfo } from "@/configs/farms/types";

export const exit = async (contractInfo: ContractInfo) => {
  try {
    const { request } = await simulateContractHelper({
      ...contractInfo,
      functionName: "exit",
      args: [],
    });

    const hash = await writeContractHelper(request);

    return await waitForTransactionReceiptHelper({ hash });
  } catch (error) {
    console.log("Stake Redeem Handler Error:", error);
  }
};
