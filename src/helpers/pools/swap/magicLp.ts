import type {
  MagicLPInfo,
  MagicLPInfoUserInfo,
} from "@/helpers/pools/swap/types";
import { formatUnits } from "viem";
import type { Address } from "viem";
//@ts-ignore
import BlastMagicLPAbi from "@/abis/BlastMagicLpAbi";
import type { PoolConfig } from "@/configs/pools/types";
import { getPoolInfo } from "@/helpers/pools/getPoolInfo";
import PMMPricing from "@/helpers/pools/swap/libs/PMMPricing";
import { getSwapRouterByChain } from "@/configs/pools/routers";
import DecimalMath from "@/helpers/pools/swap/libs/DecimalMath";
import { getPublicClient } from "@/helpers/chains/getChainsInfo";
import type { TokenPrice } from "@/helpers/prices/defiLlama";
import { getTokenPricesByChain } from "@/helpers/pools/getPoolsTokensPrices";

export const getAllPoolsByChain = async (
  chainId: number,
  poolsConfig: PoolConfig[],
  account?: Address
): Promise<any> => {
  const poolConfigsOnChain = poolsConfig.filter(
    (config) => config.chainId === chainId
  );

  const tokensPrices = await getTokenPricesByChain(poolConfigsOnChain, chainId);

  const pools = await Promise.all(
    poolsConfig
      .filter((config: PoolConfig) => config.chainId === chainId)
      .map(async (config: PoolConfig) => {
        return getPoolInfo(chainId, config, tokensPrices, account);
      })
  );

  return pools;
};

export const getLpInfo = async (
  lp: PoolConfig,
  chainId: number,
  tokensPrices: TokenPrice[],
  account?: Address
): Promise<MagicLPInfo> => {
  const publicClient = getPublicClient(chainId);

  const [
    vaultReserve,
    reserves,
    totalSupply,
    MAX_I,
    MAX_K,
    PMMState,
    baseToken,
    quoteToken,
    lpFeeRate,
    baseBalance,
    quoteBalance,
  ]: any = await publicClient.multicall({
    contracts: [
      //testnet method
      {
        address: lp.contract.address,
        abi: BlastMagicLPAbi as any,
        functionName: "getVaultReserve",
        args: [],
      },
      //mainnet method
      {
        address: lp.contract.address,
        abi: BlastMagicLPAbi as any,
        functionName: "getReserves",
        args: [],
      },
      {
        address: lp.contract.address,
        abi: BlastMagicLPAbi as any,
        functionName: "totalSupply",
        args: [],
      },
      {
        address: lp.contract.address,
        abi: BlastMagicLPAbi as any,
        functionName: "MAX_I",
        args: [],
      },
      {
        address: lp.contract.address,
        abi: BlastMagicLPAbi as any,
        functionName: "MAX_K",
        args: [],
      },
      {
        address: lp.contract.address,
        abi: BlastMagicLPAbi as any,
        functionName: "getPMMState",
        args: [],
      },
      {
        address: lp.contract.address,
        abi: BlastMagicLPAbi as any,
        functionName: "_BASE_TOKEN_",
        args: [],
      },
      {
        address: lp.contract.address,
        abi: BlastMagicLPAbi as any,
        functionName: "_QUOTE_TOKEN_",
        args: [],
      },
      {
        address: lp.contract.address,
        abi: BlastMagicLPAbi as any,
        functionName: "_LP_FEE_RATE_",
        args: [],
      },
      {
        address: lp.baseToken.contract.address,
        abi: lp.baseToken.contract.abi as any,
        functionName: "balanceOf",
        args: [lp.contract.address],
      },
      {
        address: lp.quoteToken.contract.address,
        abi: lp.quoteToken.contract.abi as any,
        functionName: "balanceOf",
        args: [lp.contract.address],
      },
    ],
  });

  let stakedTotalSupply;
  if (lp.stakeContract?.address) {
    stakedTotalSupply = await publicClient.readContract({
      address: lp.stakeContract.address,
      abi: lp.stakeContract.abi as any,
      functionName: "totalSupply",
      args: [],
    });
  }

  //
  if (lp.lockContract?.address) {
    const lockedSupply = await publicClient.readContract({
      address: lp.lockContract.address,
      abi: lp.lockContract.abi as any,
      functionName: "lockedSupply",
      args: [],
    });

    const unlockedSupply = await publicClient.readContract({
      address: lp.lockContract.address,
      abi: lp.lockContract.abi as any,
      functionName: "unlockedSupply",
      args: [],
    });

    stakedTotalSupply = lockedSupply + unlockedSupply;
  }

  const userInfo = await getUserLpInfo(
    lp,
    getSwapRouterByChain(chainId),
    account,
    chainId,
    lpFeeRate?.result || 0n
  );

  const baseTokenPrice =
    tokensPrices.find(
      ({ address }) => address === lp.baseToken.contract.address
    )?.price || 0;

  const quoteTokenPrice =
    tokensPrices.find(
      ({ address }) => address === lp.quoteToken.contract.address
    )?.price || 0;

  return {
    ...lp,
    // TODO
    config: lp,
    contract: {
      address: lp.contract.address,
      abi: BlastMagicLPAbi as any,
    },
    vaultReserve: vaultReserve.result || reserves.result,
    totalSupply: totalSupply.result,
    midPrice: Number(
      formatUnits(
        PMMPricing.getMidPrice(PMMState.result),
        lp.quoteToken.decimals
      )
    ),
    MAX_I: MAX_I.result,
    MAX_K: MAX_K.result,
    PMMState: PMMState.result,
    baseToken: baseToken.result,
    baseTokenPrice,
    quoteToken: quoteToken.result,
    quoteTokenPrice,
    lpFeeRate: lpFeeRate.result,
    balances: {
      baseBalance: baseBalance.result,
      quoteBalance: quoteBalance.result,
    },
    userInfo,
    stakedTotalSupply,
  };
};

export const getUserLpInfo = async (
  lp: PoolConfig,
  blastMIMSwapRouter: Address, // NOTICE
  account: Address | undefined,
  chainId: number,
  lpFeeRate: bigint
): Promise<any> => {
  if (!account) {
    return {
      allowance: 0n,
      balance: 0n,
      userFeeRate: {
        lpFeeRate: 0n,
        mtFeeRate: 0n,
      },
    };
  }

  const publicClient = getPublicClient(chainId);

  const contracts = [
    {
      address: lp.contract.address,
      abi: lp.contract.abi,
      functionName: "allowance",
      args: [account, blastMIMSwapRouter],
    },
    {
      address: lp.contract.address,
      abi: lp.contract.abi,
      functionName: "balanceOf",
      args: [account],
    },
  ];

  if (!lp.settings?.mlpVersion) {
    contracts.push({
      address: lp.contract.address,
      abi: lp.contract.abi,
      functionName: "getUserFeeRate",
      args: [account],
    });
  }

  const [allowance, balance, userFeeRates]: any = await publicClient.multicall({
    contracts,
  });

  const userFeeRate = {
    lpFeeRate: lpFeeRate,
    mtFeeRate: 0n,
  };

  if (userFeeRates?.result) {
    userFeeRate.lpFeeRate = userFeeRates.result[0];
    userFeeRate.mtFeeRate = userFeeRates.result[1];
  }

  return {
    allowance: allowance.result,
    balance: balance.result,
    userFeeRate,
  };
};
