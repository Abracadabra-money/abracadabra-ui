import type { Address } from "viem";
import { getPublicClient } from "@/helpers/chains/getChainsInfo";
//@ts-ignore
import BlastMagicLPAbi from "@/abis/BlastMagicLpAbi";
import MagicLPPrice from "@/abis/MagicLPPrice";
import type { MagicLPInfo, MagicLPInfoUserInfo } from "./types";
import PMMPricing from "./libs/PMMPricing";
import DecimalMath from "./libs/DecimalMath";
import { getSwapRouterByChain } from "@/configs/pools/routers";
import poolsConfig from "@/configs/pools/pools";
import type { PoolConfig } from "@/configs/pools/types";

import { getMidPriceAddressByChain } from "@/configs/pools/midPrice";
import { formatUnits } from "viem";
import { getCoinsPrices } from "@/helpers/prices/defiLlama";
import { getPoolInfo } from "../getPoolInfo";

export const getAllPoolsByChain = async (
  chainId: number,
  account?: Address
): Promise<MagicLPInfo[]> => {
  const pools = await Promise.all(
    poolsConfig
      .filter((config) => config.chainId === chainId)
      .map(async (config) => {
        return getPoolInfo(chainId, config.id, account);
      })
  );

  return pools;
};

export const getLpInfo = async (
  lp: PoolConfig,
  chainId: number,
  account?: Address
): Promise<MagicLPInfo> => {
  const publicClient = getPublicClient(chainId);

  const [
    vaultReserve,
    reserves,
    totalSupply,
    midPrice,
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
        address: getMidPriceAddressByChain(chainId),
        abi: MagicLPPrice as any,
        functionName: "getMidPrice",
        args: [lp.contract.address],
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

  const userInfo = await getUserLpInfo(
    lp.contract.address,
    getSwapRouterByChain(chainId),
    account,
    chainId
  );

  // NOTICE: will be updated when we have graph
  const statisticsData = fetchStatisticsData();

  const tokensPrices = await getCoinsPrices(chainId, [
    lp.baseToken.contract.address,
    lp.quoteToken.contract.address,
  ]);

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
    midPrice: Number(formatUnits(midPrice.result, lp.quoteToken.decimals)),
    MAX_I: MAX_I.result,
    MAX_K: MAX_K.result,
    PMMState: PMMState.result,
    baseToken: baseToken.result,
    baseTokenPrice: tokensPrices[0].price,
    quoteToken: quoteToken.result,
    quoteTokenPrice: tokensPrices[1].price,
    lpFeeRate: lpFeeRate.result,
    balances: {
      baseBalance: baseBalance.result,
      quoteBalance: quoteBalance.result,
    },
    userInfo,
    statisticsData,
  };
};

// TODO: will be updated when we have graph
export const fetchStatisticsData = () => {
  return {
    tvl: 1000000000000n,
    apr: 10n,
    liquidityValue: 200n,
    dayFees: 470n,
    dayVolume: 10n,
    weekFees: 70n,
    weekVolume: 70n,
  };
};

export const getUserLpInfo = async (
  lp: Address,
  blastMIMSwapRouter: Address, // NOTICE
  account: Address | undefined,
  chainId: number
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

  const [allowance, balance, userFeeRate]: any = await publicClient.multicall({
    contracts: [
      {
        address: lp,
        abi: BlastMagicLPAbi as any,
        functionName: "allowance",
        args: [account, blastMIMSwapRouter],
      },
      {
        address: lp,
        abi: BlastMagicLPAbi as any,
        functionName: "balanceOf",
        args: [account],
      },
      {
        address: lp,
        abi: BlastMagicLPAbi as any,
        functionName: "getUserFeeRate",
        args: [account],
      },
    ],
  });

  return {
    allowance: allowance.result,
    balance: balance.result,
    userFeeRate: {
      lpFeeRate: userFeeRate.result[0],
      mtFeeRate: userFeeRate.result[1],
    },
  };
};

export const querySellBase = (
  // trader: Address,
  payBaseAmount: bigint,
  lpInfo: MagicLPInfo,
  userLpInfo: MagicLPInfoUserInfo
) => {
  const { PMMState } = lpInfo;
  const { receiveQuoteAmount, newR } = PMMPricing.sellBaseToken(
    PMMState,
    payBaseAmount
  );

  const { mtFeeRate, lpFeeRate } = userLpInfo.userFeeRate;

  const mtFee = DecimalMath.mulFloor(receiveQuoteAmount, mtFeeRate);
  const receiveQuoteAmountAfterFee =
    receiveQuoteAmount -
    DecimalMath.mulFloor(receiveQuoteAmount, lpFeeRate) -
    mtFee;
  const newBaseTarget = PMMState.B0;

  return {
    receiveQuoteAmount: receiveQuoteAmountAfterFee,
    mtFee,
    newRState: newR,
    newBaseTarget,
  };
};

export const querySellQuote = (
  // trader: Address,
  payQuoteAmount: bigint,
  lpInfo: MagicLPInfo,
  userLpInfo: MagicLPInfoUserInfo
) => {
  const { PMMState } = lpInfo;
  const { receiveBaseAmount, newR } = PMMPricing.sellQuoteToken(
    PMMState,
    payQuoteAmount
  );

  const { mtFeeRate, lpFeeRate } = userLpInfo.userFeeRate;

  const mtFee = DecimalMath.mulFloor(receiveBaseAmount, mtFeeRate);
  const receiveBaseAmountAfterFee =
    receiveBaseAmount -
    DecimalMath.mulFloor(receiveBaseAmount, lpFeeRate) -
    mtFee;
  const newQuoteTarget = PMMState.Q0;

  return {
    receiveBaseAmount: receiveBaseAmountAfterFee,
    mtFee,
    newRState: newR,
    newQuoteTarget,
  };
};
