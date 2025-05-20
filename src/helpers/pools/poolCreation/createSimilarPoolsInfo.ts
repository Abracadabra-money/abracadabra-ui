import type { ActionConfig } from "@/helpers/pools/poolCreation/actions/createPool";
import type { Address } from "viem";
import type { MagicLPInfo } from "@/helpers/pools/swap/types";
import { getPoolsList } from "@/helpers/pools/getPoolsList";
import { getPoolConfigsByChains } from "@/helpers/pools/configs/getOrCreatePairsConfigs";
import { ZERO_ADDRESS } from "@/constants/gm";
import { getChainConfig } from "@/helpers/chains/getChainsInfo";

export const createSimilarPoolsInfo = async (
  actionConfig: ActionConfig,
  account: Address
) => {
  const similarConfigs = (await getPoolConfigsByChains())
    .filter(
      (config): config is NonNullable<typeof config> => config !== undefined
    )
    .filter(({ baseToken, quoteToken, chainId }) => {
      const wrappedNativeTokenAddress =
        getChainConfig(chainId)?.wrappedNativeTokenAddress || ZERO_ADDRESS;

      const baseAddress = baseToken.contract.address.toLowerCase();
      const quoteAddress = quoteToken.contract.address.toLowerCase();

      const actionBase = (
        actionConfig.baseToken === ZERO_ADDRESS
          ? wrappedNativeTokenAddress
          : actionConfig.baseToken
      ).toLowerCase();
      const actionQuote = (
        actionConfig.quoteToken === ZERO_ADDRESS
          ? wrappedNativeTokenAddress
          : actionConfig.quoteToken
      ).toLowerCase();

      return (
        (baseAddress === actionBase && quoteAddress === actionQuote) ||
        (baseAddress === actionQuote && quoteAddress === actionBase)
      );
    });

  const similarPools = await getPoolsList(account, similarConfigs);

  return similarPools.sort((poolA: MagicLPInfo, poolB: MagicLPInfo) => {
    const a = poolA.totalSupply;
    const b = poolB.totalSupply;
    return a > b ? 1 : -1;
  });
};

export const checkIdentity = (
  pool: MagicLPInfo,
  actionConfig: ActionConfig
) => {
  const { K: poolK, lpFeeRate: poolFeeRate } = pool.initialParameters;
  const { K, lpFeeRate } = actionConfig;

  return K === BigInt(poolK) && lpFeeRate === BigInt(poolFeeRate);
};
