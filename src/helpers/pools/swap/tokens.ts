import type { Address } from "viem";
import { getPublicClient } from "@/helpers/getPublicClient";
import { getSwapRouterByChain } from "@/configs/pools/routers";
import type { PoolConfig, TokenConfig } from "@/configs/pools/types";

export type TokenInfo = {
  config: TokenConfig;
  userInfo: {
    allowance: bigint;
    balance: bigint;
  };
  price: number;
};

type PairTokensInfo = {
  quoteToken: TokenInfo;
  baseToken: TokenInfo;
};

type PriceInfo = {
  address: string;
  price: number;
};

export const getTokenInfo = async (
  chainId: number,
  tokenConfig: TokenConfig,
  price: number,
  account?: Address
): Promise<TokenInfo> => {
  const publicClient = getPublicClient(chainId);
  const swapRouter = getSwapRouterByChain(chainId);

  const userInfo = {
    allowance: 0n,
    balance: 0n,
  };

  if (account) {
    const [balance, allowance]: any = await publicClient.multicall({
      contracts: [
        {
          address: tokenConfig.contract.address,
          abi: tokenConfig.contract.abi,
          functionName: "balanceOf",
          args: [account],
        },
        {
          address: tokenConfig.contract.address,
          abi: tokenConfig.contract.abi,
          functionName: "allowance",
          args: [account, swapRouter],
        },
      ],
    });

    userInfo.allowance = allowance.result;
    userInfo.balance = balance.result;
  }

  return {
    config: tokenConfig,
    userInfo,
    price,
  };
};

export const getPoolTokenInfo = async (
  chainId: number,
  poolConfig: PoolConfig,
  prices: PriceInfo[],
  account?: Address
): Promise<PairTokensInfo> => {
  const quoteTokenPrice =
    prices.find(
      (priceInfo) => priceInfo.address == poolConfig.quoteToken.contract.address
    )?.price || 0;

  const baseTokenPrice =
    prices.find(
      (priceInfo) => priceInfo.address == poolConfig.baseToken.contract.address
    )?.price || 0;

  const [quoteTokenInfo, baseTokenInfo] = await Promise.all([
    getTokenInfo(chainId, poolConfig.quoteToken, quoteTokenPrice, account),
    getTokenInfo(chainId, poolConfig.baseToken, baseTokenPrice, account),
  ]);

  return {
    quoteToken: quoteTokenInfo,
    baseToken: baseTokenInfo,
  };
};

// NOTICE: this function will be used to get token list on Swap page
export const getTokenListByPools = async (
  pools: Array<PoolConfig>,
  chainId: number,
  prices: PriceInfo[],
  account?: Address
): Promise<TokenInfo[]> => {
  const uniqueTokens = getAllUniqueTokens(pools);
  const swapRouter = getSwapRouterByChain(chainId);
  const publicClient = getPublicClient(chainId);

  if (!account) {
    return uniqueTokens.map((tokenConfig) => {
      const price =
        prices.find(
          (price) =>
            price.address.toLocaleLowerCase() ===
            tokenConfig.contract.address.toLocaleLowerCase()
        )?.price || 0;

      return {
        config: tokenConfig,
        userInfo: {
          allowance: BigInt(0),
          balance: BigInt(0),
        },
        price,
      };
    });
  }

  const contracts = uniqueTokens.flatMap((tokenConfig) => [
    {
      address: tokenConfig.contract.address,
      abi: tokenConfig.contract.abi,
      functionName: "balanceOf",
      args: [account],
    },
    {
      address: tokenConfig.contract.address,
      abi: tokenConfig.contract.abi,
      functionName: "allowance",
      args: [account, swapRouter],
    },
  ]);

  const results: any = await publicClient.multicall({ contracts });

  const tokenInfos: TokenInfo[] = uniqueTokens.map(
    (tokenConfig: any, index: number) => {
      const price =
        prices.find(
          (price) =>
            price.address.toLocaleLowerCase() ===
            tokenConfig.contract.address.toLocaleLowerCase()
        )?.price || 0;

      return {
        config: tokenConfig,
        userInfo: {
          allowance: results[index * 2]?.result || 0n,
          balance: results[index * 2 + 1]?.result || 0n,
        },
        price,
      };
    }
  );

  return tokenInfos;
};

export const getAllUniqueTokens = (pools: Array<PoolConfig>) => {
  return pools.reduce((acc: TokenConfig[], pool) => {
    if (
      !acc.some(
        (tokenConfig) =>
          tokenConfig.contract.address === pool.baseToken.contract.address
      )
    ) {
      acc.push(pool.baseToken);
    }
    if (
      !acc.some(
        (tokenConfig) =>
          tokenConfig.contract.address === pool.quoteToken.contract.address
      )
    ) {
      acc.push(pool.quoteToken);
    }
    return acc;
  }, [] as TokenConfig[]);
};
