import { utils } from "ethers";
import { BigNumber } from "ethers";
import type { Address } from "viem";
import { swapOogaBoogaRequest } from "@/helpers/oogaBooga";
import type { CauldronInfo } from "@/helpers/cauldron/types";
import computeAddLiquidityProportion from "@/helpers/bera/computeAddLiquidityProportion";

// return swapData bytes
export const fetchLevKodiakIslandData = async (
  cauldronObject: CauldronInfo,
  amount: BigNumber,
  slippage: number
) => {
  //@ts-ignore
  const { mim, leverageSwapper } = cauldronObject.contracts;

  const kodiakVaultAddress =
    cauldronObject.config.wrapInfo!.unwrappedToken.address;

  const { proportions, token0Info, token1Info } =
    await computeAddLiquidityProportion(kodiakVaultAddress, amount.toBigInt());

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

  return utils.defaultAbiCoder.encode(
    ["address[]", "bytes[]"],
    [
      [token0SwapResult!.to, token1SwapResult!.to],
      [token0SwapResult!.data, token1SwapResult!.data],
    ]
  );
};
