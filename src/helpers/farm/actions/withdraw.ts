import {
  writeContractHelper,
  simulateContractHelper,
  waitForTransactionReceiptHelper,
} from "@/helpers/walletClienHelper";
import type { ContractInfo } from "@/configs/farms/types";

export const withdraw = async (contractInfo: ContractInfo, args: any) => {
  try {
    const { request } = await simulateContractHelper({
      ...contractInfo,
      functionName: "withdraw",
      args,
    });

    const hash = await writeContractHelper(request);

    return await waitForTransactionReceiptHelper({ hash });
  } catch (error) {
    console.log("Stake Redeem Handler Error:", error);
  }
};
