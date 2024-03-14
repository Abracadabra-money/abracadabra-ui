import {
  getLpInfo,
  getUserLpInfo,
  querySellBase,
  querySellQuote,
} from "./magicLp";

import { previewAddLiquidity, previewRemoveLiquidity } from "./liquidity";
import { getPublicClient } from "@/helpers/getPublicClient";
import BlastMagicLPAbi from "@/abis/BlastMagicLpAbi";
import BlastMIMSwapRouterAbi from "@/abis/BlastMIMSwapRouter";
const SwapRouter = "0x73A5487F13FAB384Db55bB9A054f2d35Ef21737e";
const MimWethLp = "0xC83D75Dd43cc7B11317b89b7163604aFb184EFF8";
const account = "0x8764F421AB0C682b4Ba1d7e269C09187c1EfbFAF"; // Calibur's test
const chainId = 81457; // Blast

import blastPools from "@/configs/pools/blastPools";

export const blastTestingHelpers = async () => {
  try {
    const publicClient = getPublicClient(chainId);

    // 1. GET LP INFO
    // used to obtain information about the LP
    // @ts-ignore
    const getLpInfoResult = await getLpInfo(MimWethLp, chainId);
    // -- //

    // 2. GET USER LP INFO
    // used to obtain user information about lp
    const getUserLpInfoResult = await getUserLpInfo(
      MimWethLp,
      SwapRouter,
      account,
      chainId
    );
    console.log("getUserLpInfoResult", getUserLpInfoResult);
    // -- //

    // 3. QUERY SELL BASE
    // base token sale
    // can be taken either from the contract or locally
    // ! NOTICE: newR is not equal
    const querySellBaseResultContract = await publicClient.readContract({
      address: MimWethLp,
      abi: BlastMagicLPAbi,
      functionName: "querySellBase",
      args: [account, 1000000000000n],
    });

    console.log("querySellBaseResultContract", querySellBaseResultContract);

    const querySellBaseResult = querySellBase(
      1000000000000n,
      getLpInfoResult,
      getUserLpInfoResult
    );
    console.log("querySellBaseResult", querySellBaseResult);
    // -- //

    // 4. QUERY SELL QUOTE
    // quote token sale
    // can be taken either from the contract or locally
    // ! NOTICE: newR is OK here
    const querySellQuoteResultContract = await publicClient.readContract({
      address: MimWethLp,
      abi: BlastMagicLPAbi,
      functionName: "querySellQuote",
      args: [account, 1000000000000n],
    });

    console.log("querySellQuoteResultContract", querySellQuoteResultContract);

    const querySellQuoteResult = querySellQuote(
      1000000000000n,
      getLpInfoResult,
      getUserLpInfoResult
    );
    console.log("querySellQuoteResult", querySellQuoteResult);
    // -- //
  } catch (error) {
    console.log("testingError:", error);
  }
};

export const liquidityTests = async () => {
  const publicClient = getPublicClient(chainId);

  // 1. GET LP INFO
  // used to obtain information about the LP
  // @ts-ignore
  const getLpInfoResult = await getLpInfo(blastPools[0], chainId);
  console.log("getLpInfoResult", getLpInfoResult);
  // -- //

  // 2. PREVIEW ADD LIQUIDITY
  // can be taken either from the contract or locally
  const previewAddLiquidityResultContract = await publicClient.readContract({
    address: SwapRouter,
    abi: BlastMIMSwapRouterAbi,
    functionName: "previewAddLiquidity",
    args: [MimWethLp, 1000000n, 1000000n],
  });
  console.log(
    "previewAddLiquidityResultContract",
    previewAddLiquidityResultContract
  );

  const previewAddLiquidityResult = previewAddLiquidity(
    1000000n,
    1000000n,
    getLpInfoResult
  );
  console.log("previewAddLiquidityResult", previewAddLiquidityResult);
  // -- //

  // 3. PREVIEW ADD LIQUIDITY
  // can be taken either from the contract or locally
  // ! NOTICE: something wrong with Contract test
  const previewRemoveLiquidityResultContract = await publicClient.readContract({
    address: SwapRouter,
    abi: BlastMIMSwapRouterAbi,
    functionName: "previewRemoveLiquidity",
    args: [MimWethLp, 10000n],
  });
  console.log(
    "previewRemoveLiquidityResultContract",
    previewRemoveLiquidityResultContract
  );

  const previewRemoveLiquidityResult = previewRemoveLiquidity(
    10000n,
    getLpInfoResult
  );
  console.log("previewRemoveLiquidityResult", previewRemoveLiquidityResult);
  // -- //
};
