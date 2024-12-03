import { formatUnits, type Address } from "viem";
import { getPoolApr } from "@/helpers/pools/getPoolAPR";
import type { PoolConfig } from "@/configs/pools/types";
import { getLpInfo } from "@/helpers/pools/swap/magicLp";
import type { MagicLPInfo } from "@/helpers/pools/swap/types";
import { getPoolTokenInfo } from "@/helpers/pools/swap/tokens";
import type { TokenPrice } from "@/helpers/prices/defiLlama/index";
import { getSwapRouterByChain } from "@/configs/pools/routers";
import { getPublicClient } from "@/helpers/chains/getChainsInfo";
import type { PairTokensInfo } from "@/helpers/pools/swap/tokens";
import { getPoolTokensPrices } from "@/helpers/pools/getPoolsTokensPrices";

export const getPoolInfo = async (
  poolChainId: number,
  poolConfig: PoolConfig,
  tokensPrices?: TokenPrice[],
  account?: Address
) => {
  if (!poolConfig) return false;

  if (!tokensPrices)
    tokensPrices = await getPoolTokensPrices(poolChainId, poolConfig);

  const getLpInfoResult = await getLpInfo(
    poolConfig,
    poolChainId,
    tokensPrices,
    account
  );

  const tokens = await getTokensInfo(
    poolChainId,
    poolConfig,
    tokensPrices,
    account
  );

  const lpTokenPrice = getLpTokenPrice(getLpInfoResult, tokens);

  const poolInfo: any = {
    ...getLpInfoResult,
    price: lpTokenPrice,
    tokens,
    swapRouter: getSwapRouterByChain(Number(poolChainId)),
  };

  if (account && poolConfig.lockContract)
    poolInfo.lockInfo = await getLockInfo(account, poolChainId, poolConfig);

  if (poolConfig.stakeContract)
    poolInfo.poolAPR = await getPoolApr(poolChainId, poolInfo, tokensPrices);

  if (account && poolConfig.stakeContract)
    poolInfo.stakeInfo = await getStakeInfo(
      account,
      poolChainId,
      poolConfig,
      poolInfo.poolAPR.tokensApr!
    );

  return poolInfo;
};

const getTokensInfo = async (
  chainId: number,
  poolConfig: PoolConfig,
  tokensPrices: TokenPrice[],
  account?: Address
) => {
  const compoundTokensPrices = tokensPrices.filter(
    ({ address }) =>
      address === poolConfig.baseToken.contract.address ||
      address === poolConfig.quoteToken.contract.address
  );

  const tokens = await getPoolTokenInfo(
    chainId,
    poolConfig,
    compoundTokensPrices,
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
  config: any,
  tokensApr: any
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
        args: [account, "0x3E6648C5a70A150A88bCE65F4aD4d506Fe15d2AF"], // Warning: TODO
      },
    ],
  });

  const earnedBalances = await publicClient.multicall({
    contracts: [
      ...(config.rewardTokens || []).map((token: any) => ({
        address: config.stakeContract.address,
        abi: config.stakeContract.abi,
        functionName: "earned",
        args: [account, token.contract.address],
      })),
    ],
  });

  const earnedInfo = (config.rewardTokens || []).map(
    (token: any, index: number) => ({
      token,
      earned: earnedBalances[index].result,
      ...tokensApr[index],
    })
  );

  return {
    balance: balance.result,
    allowance: allowance.result,
    earned: earned.result,
    earnedInfo,
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
