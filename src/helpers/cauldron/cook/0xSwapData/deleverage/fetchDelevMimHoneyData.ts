import type { CauldronInfo } from "@/helpers/cauldron/types";
import type { BigNumber } from "ethers";
import { encodeAbiParameters, zeroAddress, type Address } from "viem";
import kodiakIslandRouter from "@/helpers/bera/kodiakIslandRouter";

import { BERA_HONEY_ADDRESS } from "@/helpers/bera/kodiakIslandRouter/constants";
import { swapOogaBoogaRequest } from "@/helpers/oogaBooga";

const swapDataAbi = {
  components: [
    {
      name: "to",
      type: "address",
    },
    {
      name: "swapData",
      type: "bytes",
    },
  ],
  name: "SwapInfo",
  type: "tuple",
} as const;

const fetchDelevMimHoneyData = async (
  cauldronObject: CauldronInfo,
  amount: BigNumber,
  slippage: number,
  to: Address
) => {
  //@ts-ignore
  const { collateral, liquidationSwapper, mim } = cauldronObject.contracts;

  const kodiakVaultAddress =
    cauldronObject.config.wrapInfo!.unwrappedToken.address;

  const kodiakVaultAmount = await collateral.convertToAssets(amount);

  const removeLiquidityPreview =
    await kodiakIslandRouter.removeLiquidityPreview(
      kodiakVaultAmount,
      kodiakVaultAddress,
      to
    );

  const honeySwapResult = await swapOogaBoogaRequest(
    mim.address as Address,
    BERA_HONEY_ADDRESS,
    slippage,
    removeLiquidityPreview!.amount1,
    liquidationSwapper!.address as Address
  );

  const swapData = encodeAbiParameters(
    [swapDataAbi, swapDataAbi],
    [
      { to: zeroAddress, swapData: "0x0" },
      { to: honeySwapResult!.to, swapData: honeySwapResult!.data },
    ]
  );

  return swapData;
};

export default fetchDelevMimHoneyData;
