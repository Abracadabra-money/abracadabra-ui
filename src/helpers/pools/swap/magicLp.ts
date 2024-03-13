import type { Address } from "viem";
import { getPublicClient } from "@/helpers/getPublicClient";
//@ts-ignore
import BlastMagicLPAbi from "@/abis/BlastMagicLpAbi";
import type { MagicLPInfo, MagicLPInfoUserInfo } from "./types";
import PMMPricing from "./libs/PMMPricing";
import DecimalMath from "./libs/DecimalMath";
import { getSwapRouterByChain } from "@/configs/pools/routers";
import poolsConfig from "@/configs/pools/pools";
import type { PoolConfig } from "@/configs/pools/types";

export const getAllPoolsByChain = async (
  chainId: number,
  account?: Address
): Promise<MagicLPInfo[]> => {
  const pools = await Promise.all(
    poolsConfig
      .filter((config) => config.chainId === chainId)
      .map(async (config) => {
        return getLpInfo(config, chainId, account);
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
        functionName: "getMidPrice",
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

  return {
    ...lp,
    contract: {
      address: lp.contract.address,
      abi: BlastMagicLPAbi as any,
    },
    vaultReserve: vaultReserve.result || reserves.result,
    totalSupply: totalSupply.result,
    midPrice: midPrice.result,
    MAX_I: MAX_I.result,
    MAX_K: MAX_K.result,
    PMMState: PMMState.result,
    baseToken: baseToken.result,
    quoteToken: quoteToken.result,
    lpFeeRate: lpFeeRate.result,
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
  const { PMMState, lpFeeRate } = lpInfo;
  const { receiveQuoteAmount, newR } = PMMPricing.sellBaseToken(
    PMMState,
    payBaseAmount
  );

  const { mtFeeRate } = userLpInfo.userFeeRate;

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
  const { PMMState, lpFeeRate } = lpInfo;
  const { receiveBaseAmount, newR } = PMMPricing.sellQuoteToken(
    PMMState,
    payQuoteAmount
  );

  const { mtFeeRate } = userLpInfo.userFeeRate;
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
