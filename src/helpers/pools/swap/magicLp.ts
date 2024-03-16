import type { Address } from "viem";
import { getPublicClient } from "@/helpers/getPublicClient";
//@ts-ignore
import BlastMagicLPAbi from "@/abis/BlastMagicLpAbi";

export const getUserLpInfo = async (
  lp: Address,
  blastMIMSwapRouter: Address, // NOTICE
  account: Address | undefined,
  chainId: number
): Promise<any> => {
  if (!account) {
    return {
      allowance: 0n,
      balance: 0n,
      userFeeRate: {
        lpFeeRate: 0n,
        mtFeeRate: 0n,
      },
    };
  }

  const publicClient = getPublicClient(chainId);

  const [allowance, balance, userFeeRate]: any = await publicClient.multicall({
    contracts: [
      {
        address: lp,
        abi: BlastMagicLPAbi as any,
        functionName: "allowance",
        args: [account, blastMIMSwapRouter],
      },
      {
        address: lp,
        abi: BlastMagicLPAbi as any,
        functionName: "balanceOf",
        args: [account],
      },
      {
        address: lp,
        abi: BlastMagicLPAbi as any,
        functionName: "getUserFeeRate",
        args: [account],
      },
    ],
  });

  return {
    allowance: allowance.result,
    balance: balance.result,
    userFeeRate: {
      lpFeeRate: userFeeRate.result[0],
      mtFeeRate: userFeeRate.result[1],
    },
  };
};
