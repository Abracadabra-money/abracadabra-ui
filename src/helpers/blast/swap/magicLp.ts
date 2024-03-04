import type { Address } from "viem";
import { getPublicClient } from "@/helpers/getPublicClient";
import BlastMagicLPAbi from "@/abis/BlastMagicLP";
import type { MagicLPInfo, MagicLPInfoUserInfo } from "./types";
import PMMPricing from "./libs/PMMPricing";
import DecimalMath from "./libs/DecimalMath";

export const getLpInfo = async (
  lp: Address,
  chainId: number
): Promise<MagicLPInfo> => {
  const publicClient = getPublicClient(chainId);

  const [
    name,
    decimals,
    vaultReserve,
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
      {
        address: lp,
        abi: BlastMagicLPAbi as any,
        functionName: "name",
        args: [],
      },
      {
        address: lp,
        abi: BlastMagicLPAbi as any,
        functionName: "decimals",
        args: [],
      },
      {
        address: lp,
        abi: BlastMagicLPAbi as any,
        functionName: "getVaultReserve",
        args: [],
      },
      {
        address: lp,
        abi: BlastMagicLPAbi as any,
        functionName: "totalSupply",
        args: [],
      },
      {
        address: lp,
        abi: BlastMagicLPAbi as any,
        functionName: "getMidPrice",
        args: [],
      },
      {
        address: lp,
        abi: BlastMagicLPAbi as any,
        functionName: "MAX_I",
        args: [],
      },
      {
        address: lp,
        abi: BlastMagicLPAbi as any,
        functionName: "MAX_K",
        args: [],
      },
      {
        address: lp,
        abi: BlastMagicLPAbi as any,
        functionName: "getPMMState",
        args: [],
      },
      {
        address: lp,
        abi: BlastMagicLPAbi as any,
        functionName: "_BASE_TOKEN_",
        args: [],
      },
      {
        address: lp,
        abi: BlastMagicLPAbi as any,
        functionName: "_QUOTE_TOKEN_",
        args: [],
      },
      {
        address: lp,
        abi: BlastMagicLPAbi as any,
        functionName: "_LP_FEE_RATE_",
        args: [],
      },
    ],
  });

  return {
    contract: {
      address: lp,
      abi: BlastMagicLPAbi as any,
    },
    name,
    decimals,
    vaultReserve,
    totalSupply,
    midPrice,
    MAX_I,
    MAX_K,
    PMMState,
    baseToken,
    quoteToken,
    lpFeeRate,
  };
};

export const getUserLpInfo = async (
  lp: Address,
  blastMIMSwapRouter: Address, // NOTICE
  account: Address,
  chainId: number
): Promise<any> => {
  const publicClient = getPublicClient(chainId);

  // TODO
  //   const blastMIMSwapRouter = "0x15f57fbCB7A443aC6022e051a46cAE19491bC298";

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
    allowance,
    balance,
    userFeeRate,
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

  const mtFeeRate = userLpInfo.userFeeRate;

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

  const mtFeeRate = userLpInfo.userFeeRate;
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
