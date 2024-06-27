import { getLpInfo } from "@/helpers/pools/swap/magicLp";
import poolsConfig from "@/configs/pools/pools";
import { formatUnits, type Address } from "viem";
import type { PoolConfig } from "@/configs/pools/types";
import type { PairTokensInfo } from "@/helpers/pools/swap/tokens";

import type { MagicLPInfo } from "@/helpers/pools/swap/types";
import { getPoolTokenInfo } from "@/helpers/pools/swap/tokens";
import { getCoinsPrices } from "@/helpers/prices/defiLlama/index";
import { getSwapRouterByChain } from "@/configs/pools/routers";

import { getPublicClient } from "@/helpers/chains/getChainsInfo";

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

  const poolInfo: any = {
    ...getLpInfoResult,
    price: lpTokenPrice,
    tokens,
    swapRouter: getSwapRouterByChain(poolChainId),
  };

  if (account && poolConfig.lockContract)
    poolInfo.lockInfo = await getLockInfo(account, poolChainId, poolConfig);

  if (account && poolConfig.stakeContract)
    poolInfo.stakeInfo = await getStakeInfo(account, poolChainId, poolConfig);

  return poolInfo;
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

export const getLockInfo = async (
  account: Address,
  chainId: number,
  config: any
) => {
  const publicClient = getPublicClient(chainId);

  const [balances, allowance]: any = await publicClient.multicall({
    contracts: [
      {
        address: config.lockContract.address,
        abi: config.lockContract.abi,
        functionName: "balances",
        args: [account],
      },
      {
        address: config.contract.address,
        abi: config.contract.abi,
        functionName: "allowance",
        args: [account, config.lockContract.address],
      },
    ],
  });

  const { locked, unlocked }: any = balances.result;

  return {
    balances: {
      unlocked,
      locked,
      total: locked + unlocked,
    },
    allowance: allowance.result,
  };
};

export const getStakeInfo = async (
  account: Address,
  chainId: number,
  config: any
) => {
  const publicClient = getPublicClient(chainId);

  const [balance, allowance, earned]: any = await publicClient.multicall({
    contracts: [
      {
        address: config.stakeContract.address,
        abi: config.stakeContract.abi,
        functionName: "balanceOf",
        args: [account],
      },
      {
        address: config.contract.address,
        abi: config.contract.abi,
        functionName: "allowance",
        args: [account, config.stakeContract.address],
      },
      {
        address: config.stakeContract.address,
        abi: config.stakeContract.abi,
        functionName: "earned",
        args: [account, "0xc86c7C0eFbd6A49B35E8714C5f59D99De09A225b"], // Warning: TODO
      },
    ],
  });

  return {
    balance: balance.result,
    allowance: allowance.result,
    earned: earned.result,
  };
};

export const getUserLocks = async (
  account: Address,
  chainId: number,
  config: any
) => {
  const publicClient = getPublicClient(chainId);

  const userLocks: any = await publicClient.readContract({
    address: config.lockContract.address,
    abi: config.lockContract.abi,
    functionName: "userLocks",
    args: [account],
  });

  return userLocks;
};
