import type { Address } from "viem";

import {
  getLpInfo,
  getUserLpInfo,
  querySellBase,
  querySellQuote,
} from "./magicLp";

import type { MagicLPInfo, MagicLPInfoUserInfo } from "./types";

const MimWethLp = "0x06894D4b33565dF998E80dE5D1718Ac5425DA216";
const SwapRouter = "0x15f57fbCB7A443aC6022e051a46cAE19491bC298";
const account = "0x8764F421AB0C682b4Ba1d7e269C09187c1EfbFAF"; // Calibur's test
const chainId = 168587773; // Blast Sepolia testnet

type swapActionConfig = {
  fromToken: Address;
  toToken: Address;
  amountIn: bigint;
  slippage: bigint;
  deadline: bigint;
};

export const swapTesting = async (actionConfig: swapActionConfig) => {
  const matchesPairs = await isPairsExist(
    actionConfig.fromToken,
    actionConfig.toToken
  );

  if (matchesPairs === undefined) {
    // TODO: auto routing
    console.log("There no matches");
    return false;
  }

  // [0] - testing
  const swapResult = computeSwapResult(matchesPairs[0], actionConfig);

  console.log("swapResult", swapResult);
};

const computeSwapResult = async (
  lpInfo: MagicLPInfo,
  swapActionConfig: swapActionConfig
) => {
  // TODO
  const getUserLpInfoResult = await getUserLpInfo(
    MimWethLp,
    SwapRouter,
    account,
    chainId
  );

  const isSellBase =
    lpInfo.baseToken.toLowerCase() === swapActionConfig.fromToken.toLowerCase();
  const isSellQuote =
    lpInfo.quoteToken.toLowerCase() ===
    swapActionConfig.fromToken.toLowerCase();

  if (isSellBase) {
    return querySellBase(
      swapActionConfig.amountIn,
      lpInfo,
      getUserLpInfoResult
    );
  }

  if (isSellQuote) {
    return querySellQuote(
      swapActionConfig.amountIn,
      lpInfo,
      getUserLpInfoResult
    );
  }
};

const isPairsExist = async (
  token0: Address,
  token1: Address
): Promise<Array<MagicLPInfo> | undefined> => {
  // NOTICE: testing

  const pairs: Array<MagicLPInfo> = [await getLpInfo(MimWethLp, chainId)];

  const matches = pairs.filter((pair: MagicLPInfo) => {
    return (
      (pair.baseToken.toLowerCase() === token0.toLowerCase() &&
        pair.quoteToken.toLowerCase() === token1.toLowerCase()) ||
      (pair.quoteToken.toLowerCase() === token0.toLowerCase() &&
        pair.baseToken.toLowerCase() === token1.toLowerCase())
    );
  });

  // TODO: best match by fees, etc.
  return matches;
};
