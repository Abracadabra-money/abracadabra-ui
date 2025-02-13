import type { CauldronInfo } from "@/helpers/cauldron/types";

import { BigNumber } from "ethers";
import { encodeAbiParameters, zeroAddress, type Address } from "viem";

import { BERA_HONEY_ADDRESS } from "@/helpers/bera/kodiakIslandRouter/constants";
import { swapOogaBoogaRequest } from "@/helpers/oogaBooga";

import computeAddLiquidityProportion from "@/helpers/bera/computeAddLiquidityProportion";

// return swapData bytes
const fetchLevMimHoneyData = async (
  cauldronObject: CauldronInfo,
  amount: BigNumber,
  slippage: number
) => {
  //@ts-ignore
  const { mim, leverageSwapper } = cauldronObject.contracts;

  const kodiakVaultAddress =
    cauldronObject.config.wrapInfo!.unwrappedToken.address;

  const proportions = await computeAddLiquidityProportion(
    kodiakVaultAddress,
    amount.toBigInt(),
    0n
  );

  const sellAmount = BigNumber.from(proportions.token1ProportionAmount)

  const mimSwapResult = await swapOogaBoogaRequest(
    BERA_HONEY_ADDRESS,
    mim.address as Address,
    slippage,
    sellAmount,
    leverageSwapper!.address as Address
  );

  const token0SwapData = encodeAbiParameters(
    [{ type: "address" }, { type: "bytes" }],
    [mimSwapResult!.to, mimSwapResult!.data]
  );

  // no need to swap for HONEY
  const token1SwapData = encodeAbiParameters(
    [{ type: "address" }, { type: "bytes" }],
    [zeroAddress, "0x0"]
  );

  const swapData = encodeAbiParameters(
    [{ type: "bytes" }, { type: "bytes" }],
    [token0SwapData, token1SwapData]
  );

  return swapData;
};

export default fetchLevMimHoneyData;
