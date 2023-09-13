import {
  prepareWriteContract,
  waitForTransaction,
  writeContract,
} from "@wagmi/core";
import type { ContractInfo } from "@/utils/farmsConfig/types";

export const deposit = async (
  contractInfo: ContractInfo,
  poolId: number,
  amount: bigint
) => {
  try {
    const config = await prepareWriteContract({
      ...contractInfo,
      functionName: "deposit",
      args: [poolId, amount],
    });

    const { hash } = await writeContract(config);

    return await waitForTransaction({ hash });
  } catch (error) {
    console.log("Stake Redeem Handler Error:", error);
  }
};
