import type { CauldronInfo } from "@/helpers/cauldron/types";

import { BigNumber } from "ethers";
import { encodeAbiParameters, type Address } from "viem";
import { swapOogaBoogaRequest } from "@/helpers/oogaBooga";
import { computeBexAddLiquidityProportion } from "@/helpers/bera/computeBexAddLiquidityProportion";

// const swapDataAbi = {
//   components: [
//     {
//       name: "to",
//       type: "address",
//     },
//     {
//       name: "swapData",
//       type: "bytes",
//     },
//   ],
//   name: "SwapInfo",
//   type: "tuple",
// } as const;

// return swapData bytes
const fetchLevBeraBexData = async (
  cauldronObject: CauldronInfo,
  amount: BigNumber,
  slippage: number
) => {
  //@ts-ignore
  const { mim, leverageSwapper } = cauldronObject.contracts;

  const lpAddress = cauldronObject.config.wrapInfo!.unwrappedToken.address;

  const { proportions, token0Info, token1Info } =
    await computeBexAddLiquidityProportion(lpAddress, amount.toBigInt());

  const token0SellAmount = BigNumber.from(proportions.token0ProportionAmount);
  const token1SellAmount = BigNumber.from(proportions.token1ProportionAmount);

  const token0SwapResult = await swapOogaBoogaRequest(
    token0Info.address,
    mim.address as Address,
    slippage,
    token0SellAmount,
    leverageSwapper!.address as Address
  );

  const token1SwapResult = await swapOogaBoogaRequest(
    token1Info.address,
    mim.address as Address,
    slippage,
    token1SellAmount,
    leverageSwapper!.address as Address
  );

  const swapData = encodeAbiParameters(
    [["address", "address"], ["bytes", "bytes"]],
    //@ts-ignore
    [
      [token0SwapResult!.to, token1SwapResult!.to],
      [token0SwapResult!.data, token1SwapResult!.data],
    ]
  );

  return swapData;
};

export default fetchLevBeraBexData;
