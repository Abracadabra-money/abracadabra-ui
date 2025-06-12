import type { ActionConfig } from "@/helpers/pools/poolCreation/actions/createPool";
import type { Address } from "viem";
import type { MagicLPInfo } from "@/helpers/pools/swap/types";
import { getPoolsList } from "@/helpers/pools/getPoolsList";
import {
  findOrCreatePoolConfig,
  getPoolConfigsByChains,
} from "@/helpers/pools/configs/getOrCreatePairsConfigs";
import type { PoolConfig } from "@/configs/pools/types";
import {
  fetchPoolsAddressesFromFabric,
  fetchPendingPoolsData,
} from "./fetchPoolsFromFabric";
import type { GraphPairConfig } from "@/helpers/pools/configs/fetchPairsList";

const getSimilarConfigs = async (actionConfig: ActionConfig) => {
  const similarConfigs = (await getPoolConfigsByChains())
    .filter(
      (config): config is NonNullable<typeof config> => config !== undefined
    )
    .filter(({ baseToken, quoteToken }) => {
      const baseAddress = baseToken.contract.address.toLowerCase();
      const quoteAddress = quoteToken.contract.address.toLowerCase();
      const actionBase = actionConfig.baseToken.toLowerCase();
      const actionQuote = actionConfig.quoteToken.toLowerCase();

      return (
        (baseAddress === actionBase && quoteAddress === actionQuote) ||
        (baseAddress === actionQuote && quoteAddress === actionBase)
      );
    });

  return similarConfigs;
};

const getSortedSimilarPools = async (
  similarConfigs: PoolConfig[],
  account: Address
) => {
  const similarPools = await getPoolsList(account, similarConfigs);

  return similarPools.sort((poolA: MagicLPInfo, poolB: MagicLPInfo) => {
    const a = poolA.totalSupply;
    const b = poolB.totalSupply;
    return a > b ? 1 : -1;
  });
};

const getPendingPoolsAddresses = (
  factoryPools: Address[],
  similarConfigs: PoolConfig[]
) => {
  const similarPoolsAddresses: Address[] = similarConfigs.map(
    (config) => config.contract.address.toLowerCase() as Address
  );

  return factoryPools.filter(
    (address) =>
      !similarPoolsAddresses.includes(address.toLowerCase() as Address)
  );
};

export const createSimilarPoolsInfo = async (
  actionConfig: ActionConfig,
  account: Address,
  chainId: number
) => {
  const similarConfigs = await getSimilarConfigs(actionConfig);

  // Check if there's an identical pool among similarConfigs
  const hasIdenticalPool = similarConfigs.some((config) =>
    checkIdentity(config, actionConfig)
  );

  if (hasIdenticalPool) {
    return await getSortedSimilarPools(similarConfigs, account);
  }

  // Get pools from factory
  const factoryPools: Address[] = await fetchPoolsAddressesFromFabric(
    chainId,
    actionConfig.baseToken,
    actionConfig.quoteToken
  );

  const pendingPoolsAddresses = getPendingPoolsAddresses(
    factoryPools,
    similarConfigs
  );
  // Get data for pending pools
  const pendingPoolsData = await fetchPendingPoolsData(
    chainId,
    pendingPoolsAddresses
  );

  // Check if there's an identical pool among pending pools
  const identicalPendingPool = pendingPoolsData.find((pool) =>
    checkGraphPairConfigIdentity(pool, actionConfig)
  );

  if (identicalPendingPool) {
    const identicalPoolConfig = await findOrCreatePoolConfig(
      identicalPendingPool,
      chainId
    );

    similarConfigs.unshift(identicalPoolConfig);
  }

  return await getSortedSimilarPools(similarConfigs, account);
};

export const checkIdentity = (pool: PoolConfig, actionConfig: ActionConfig) => {
  const { K: poolK, lpFeeRate: poolFeeRate } = pool.initialParameters;
  const { K, lpFeeRate } = actionConfig;

  const baseAddress = pool.baseToken.contract.address.toLowerCase();
  const quoteAddress = pool.quoteToken.contract.address.toLowerCase();
  const actionBase = actionConfig.baseToken.toLowerCase();
  const actionQuote = actionConfig.quoteToken.toLowerCase();

  const tokensMatch =
    (baseAddress === actionBase && quoteAddress === actionQuote) ||
    (baseAddress === actionQuote && quoteAddress === actionBase);

  return (
    K === BigInt(poolK) && lpFeeRate === BigInt(poolFeeRate) && tokensMatch
  );
};

const checkGraphPairConfigIdentity = (
  pendingPool: GraphPairConfig,
  actionConfig: ActionConfig
) => {
  const baseAddress = pendingPool.baseToken.id.toLowerCase();
  const quoteAddress = pendingPool.quoteToken.id.toLowerCase();
  const actionBase = actionConfig.baseToken.toLowerCase();
  const actionQuote = actionConfig.quoteToken.toLowerCase();

  const tokensMatch =
    (baseAddress === actionBase && quoteAddress === actionQuote) ||
    (baseAddress === actionQuote && quoteAddress === actionBase);

  return (
    pendingPool.k === actionConfig.K &&
    pendingPool.lpFeeRate === actionConfig.lpFeeRate &&
    tokensMatch
  );
};
