import { walletTokens } from "@/helpers/collateralsApy/getMagicGlpApy/constants";
import type { AdditionalInfo } from "@/helpers/collateralsApy/getMagicGlpApy/types";

export const getAdditionalInfo = async (
  contracts: any,
  chainId: number,
  address: string
): Promise<AdditionalInfo> => {
  const tokens = walletTokens[chainId as keyof typeof walletTokens];

  const [aums, glpSupply, feePercent, feePercentBips] = await Promise.all([
    contracts.glpManagerContract.getAums(),
    contracts.readerContract.getTokenBalancesWithSupplies(address, tokens),
    contracts.aggregatorContract?.feePercent
      ? contracts.aggregatorContract?.feePercent()
      : 0,
    contracts.magicGlpHarvestorContract.feePercentBips(),
  ]);

  return {
    aum: aums[0].add(aums[1]).div(2),
    glpSupply: glpSupply[5],
    fees: {
      feePercent: feePercent / 100,
      feePercentBips: feePercentBips / 10000,
    },
  };
};
