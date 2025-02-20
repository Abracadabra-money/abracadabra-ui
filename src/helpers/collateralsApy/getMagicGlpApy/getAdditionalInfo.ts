import { walletTokens } from "@/helpers/collateralsApy/getMagicGlpApy/constants";
import type { AdditionalInfo } from "@/helpers/collateralsApy/getMagicGlpApy/types";
import type { ContractInfo } from "@/types/global";
import type { PublicClient } from "viem";

export const getAdditionalInfo = async (
  contracts: Record<string, ContractInfo>,
  chainId: number,
  address: string,
  publicClient: PublicClient
): Promise<AdditionalInfo> => {
  const tokens = walletTokens[chainId as keyof typeof walletTokens];


  const [{ result: aums }, { result: glpSupply }, { result: feePercent }, { result: feePercentBips }]: any =
    await publicClient.multicall({
      contracts: [
        {
          ...contracts.glpManager,
          functionName: 'getAums',
          args: []
        },
        {
          ...contracts.reader,
          functionName: 'getTokenBalancesWithSupplies',
          args: [address, tokens]
        },
        {
          ...contracts.aggregator,
          functionName: 'feePercent',
          args: []
        },
        {
          ...contracts.magicGlpHarvestor,
          functionName: 'feePercentBips',
          args: []
        }
      ],
    });

  return {
    aum: (aums[0] + aums[1]) / 2n,
    glpSupply: glpSupply[5],
    fees: {
      feePercent: feePercent / 100,
      feePercentBips: feePercentBips / 10000,
    },
  };
};
