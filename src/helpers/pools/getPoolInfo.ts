import { getLpInfo } from "@/helpers/pools/swap/magicLp";
import poolsConfig from "@/configs/pools/pools";
import { formatUnits, type Address } from "viem";
import { getCoinsPrices } from "@/helpers/prices/defiLlama/index";
import { getSwapRouterByChain } from "@/configs/pools/routers";
import { getPublicClient } from "@/helpers/chains/getChainsInfo";
import { getPoolTokenInfo } from "@/helpers/pools/swap/tokens";
import type { PoolConfig, PoolInfo, LockInfo } from "@/configs/pools/types";
import type { PairTokensInfo } from "@/helpers/pools/swap/tokens";
import type { MagicLPInfo } from "@/helpers/pools/swap/types";

export const getPoolInfo = async (
  poolChainId: number,
  poolId: number,
  account: Address
): Promise<PoolInfo | null> => {
  const poolConfig: PoolConfig | undefined = poolsConfig.find(
    ({ id, chainId }: PoolConfig) => id == poolId && chainId == poolChainId
  );

  if (!poolConfig) return null;

  const getLpInfoResult: MagicLPInfo = await getLpInfo(
    poolConfig,
    poolChainId,
    account
  );

  const tokens: PairTokensInfo = await getTokensInfo(
    poolChainId,
    poolConfig,
    account
  );

  const lpTokenPrice: number = getLpTokenPrice(getLpInfoResult, tokens);

  const poolInfo: PoolInfo = {
    ...getLpInfoResult,
    price: lpTokenPrice,
    tokens,
    swapRouter: getSwapRouterByChain(poolChainId),
  };

  if (account && poolConfig.lockContract)
    poolInfo.lockInfo = await getLockInfo(account, poolChainId, poolConfig);

  return poolInfo;
};

const getTokensInfo = async (
  chainId: number,
  poolConfig: PoolConfig,
  account: Address
): Promise<PairTokensInfo> => {
  const tokensPrices = await getCoinsPrices(chainId, [
    poolConfig.baseToken.contract.address,
    poolConfig.quoteToken.contract.address,
  ]);

  const tokens: PairTokensInfo = await getPoolTokenInfo(
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
): number => {
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

export const getLockInfo = async (
  account: Address,
  chainId: number,
  config: PoolConfig
): Promise<LockInfo> => {
  const publicClient = getPublicClient(chainId);

  const [balances, allowance]: any = await publicClient.multicall({
    contracts: [
      {
        address: config.lockContract!.address,
        abi: config.lockContract!.abi,
        functionName: "balances",
        args: [account],
      },
      {
        address: config.contract.address,
        abi: config.contract.abi,
        functionName: "allowance",
        args: [account, config.lockContract!.address],
      },
    ],
  });

  const { locked, unlocked } = balances.result;

  return {
    balances: {
      unlocked,
      locked,
      total: locked + unlocked,
    },
    allowance: allowance.result,
  };
};

export const getUserLocks = async (
  account: Address,
  chainId: number,
  config: PoolInfo
) => {
  if (!config.lockContract) return [];

  const publicClient = getPublicClient(chainId);

  const userLocks: any = await publicClient.readContract({
    address: config.lockContract.address,
    abi: config.lockContract.abi,
    functionName: "userLocks",
    args: [account],
  });

  return userLocks;
};
