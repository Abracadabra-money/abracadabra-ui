import { getLpInfo } from "@/helpers/pools/swap/magicLp";
import { parseUnits, type Address } from "viem";
import poolsConfig from "@/configs/pools/pools";
import type { PoolConfig } from "@/configs/pools/types";
import { getPoolTokenInfo } from "@/helpers/pools/swap/tokens";
import { getCoinsPrices } from "@/helpers/prices/defiLlama/index";
import { getSwapRouterByChain } from "@/configs/pools/routers"

const RATE_PRECISION: bigint = parseUnits("1", 18);

export const getPoolInfo = async (
  poolChainId: number,
  poolId: number,
  account: Address
) => {
  const poolConfig = poolsConfig.find(
    ({ id, chainId }: PoolConfig) => id == poolId && chainId == poolChainId
  );

  if (!poolConfig) return false;

  const getLpInfoResult = await getLpInfo(poolConfig, poolChainId, account);

  const tokens = await getTokensInfo(poolChainId, poolConfig, account);

  return {
    ...getLpInfoResult,
    tokens,
    swapRouter: getSwapRouterByChain(poolChainId),
  };
};

const getTokensInfo = async (
  chainId: number,
  poolConfig: PoolConfig,
  account: Address
) => {
  const tokensPrices = await getCoinsPrices(chainId, [
    poolConfig.baseToken.contract.address,
    poolConfig.quoteToken.contract.address,
  ]);

  const tokens = await getPoolTokenInfo(
    chainId,
    poolConfig,
    tokensPrices,
    account
  );

  return { ...tokens, ratePrecision: RATE_PRECISION };
};
