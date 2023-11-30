import {
  prepareWriteContract,
  waitForTransaction,
  writeContract,
} from "@wagmi/core";
import type { ContractInfo } from "@/utils/farmsConfig/types";

export const exit = async (contractInfo: ContractInfo) => {
  try {
    const config = await prepareWriteContract({
      ...contractInfo,
      functionName: "exit",
      args: [],
    });

    const { hash } = await writeContract(config);

    return await waitForTransaction({ hash });
  } catch (error) {
    console.log("Stake Redeem Handler Error:", error);
  }
};
