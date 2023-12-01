import {
    prepareWriteContract,
    waitForTransaction,
    writeContract,
  } from "@wagmi/core";
  import type { ContractInfo } from "@/utils/farmsConfig/types";
  
  export const stake = async (
    contractInfo: ContractInfo,
    amount: bigint
  ) => {
    try {
      const config = await prepareWriteContract({
        ...contractInfo,
        functionName: "stake",
        args: [amount],
      });
  
      const { hash } = await writeContract(config);
  
      return await waitForTransaction({ hash });
    } catch (error) {
      console.log("Stake Handler Error:", error);
    }
  };
  