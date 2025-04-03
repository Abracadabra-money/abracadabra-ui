import type { CauldronInfo } from "@/helpers/cauldron/types";
import type { BigNumber } from "ethers";
import { type Address } from "viem";
import { swapOogaBoogaRequest } from "@/helpers/oogaBooga";
import exitPool from "@/helpers/bera/bex/exitPool";
import { utils } from "ethers";

const fetchDelevBeraBexData = async (
  cauldronObject: CauldronInfo,
  amount: BigNumber,
  slippage: number,
  to: Address
) => {
  //@ts-ignore
  const { collateral, liquidationSwapper, mim } = cauldronObject.contracts;

  const lpAddress = cauldronObject.config.wrapInfo!.unwrappedToken.address;

  const lpAmount = await collateral.convertToAssets(amount);

  const exitPoolPreview = await exitPool(lpAddress, lpAmount, to);

  const token0SwapResult = await swapOogaBoogaRequest(
    mim.address as Address,
    exitPoolPreview.token0Address as Address,
    slippage,
    exitPoolPreview.token0AmountOut,
    liquidationSwapper!.address as Address
  );

  const token1SwapResult = await swapOogaBoogaRequest(
    mim.address as Address,
    exitPoolPreview.token1Address as Address,
    slippage,
    exitPoolPreview.token1AmountOut,
    liquidationSwapper!.address as Address
  );

  const swapData = utils.defaultAbiCoder.encode(
    ["address[]", "bytes[]"],
    [
      [token0SwapResult!.to, token1SwapResult!.to],
      [token0SwapResult!.data, token1SwapResult!.data],
    ]
  );

  // const swapData = encodeAbiParameters(
  //   [
  //     ["address", "address"],
  //     ["bytes", "bytes"],
  //   ],
  //   //@ts-ignore
  //   [
  //     [token0SwapResult!.to, token1SwapResult!.to],
  //     [token0SwapResult!.data, token1SwapResult!.data],
  //   ]
  // );

  return swapData;
};

export default fetchDelevBeraBexData;
