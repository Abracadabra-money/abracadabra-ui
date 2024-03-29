import { getLpInfo } from "@/helpers/pools/swap/magicLp";
import poolsConfig from "@/configs/pools/pools";
import { formatUnits, type Address } from "viem";
import type { PoolConfig } from "@/configs/pools/types";
import type { PairTokensInfo } from "@/helpers/pools/swap/tokens";

import type { MagicLPInfo } from "@/helpers/pools/swap/types";
import { getPoolTokenInfo } from "@/helpers/pools/swap/tokens";
import { getCoinsPrices } from "@/helpers/prices/defiLlama/index";
import { getSwapRouterByChain } from "@/configs/pools/routers";

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

  const lpTokenPrice = getLpTokenPrice(getLpInfoResult, tokens);

  return {
    ...getLpInfoResult,
    price: lpTokenPrice,
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

  return tokens;
};

export const getLpTokenPrice = (
  lpInfo: MagicLPInfo,
  tokens: PairTokensInfo
) => {
  const formattedTotalSupply = Number(
    formatUnits(lpInfo.totalSupply, lpInfo.decimals)
  );

  const baseTokenReserve = Number(
    formatUnits(lpInfo.vaultReserve[0], tokens.baseToken.config.decimals)
  );
  const baseTokenPrice = tokens.baseToken.price;
  const baseTokenValue = baseTokenReserve * baseTokenPrice;

  const quoteTokenReserve = Number(
    formatUnits(lpInfo.vaultReserve[1], tokens.quoteToken.config.decimals)
  );
  const quoteTokenPrice = tokens.quoteToken.price;
  const quoteTokenValue = quoteTokenReserve * quoteTokenPrice;

  const tvl = baseTokenValue + quoteTokenValue;

  const lpTokenPrice = tvl / formattedTotalSupply;

  return lpTokenPrice;
};
