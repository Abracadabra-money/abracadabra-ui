import {
  prepareWriteContract,
  waitForTransaction,
  writeContract,
} from "@wagmi/core";
import type { ContractInfo } from "@/utils/farmsConfig/types";

export const withdraw = async (
  contractInfo: ContractInfo,
  args: any
) => {
  try {
    const config = await prepareWriteContract({
      ...contractInfo,
      functionName: "withdraw",
      args,
    });

    const { hash } = await writeContract(config);

    return await waitForTransaction({ hash });
  } catch (error) {
    console.log("Stake Redeem Handler Error:", error);
  }
};
