import type { CauldronInfo } from "@/helpers/cauldron/types";
import type { BigNumber } from "ethers";
import type { Address } from "viem";
import kodiakIslandRouter from "@/helpers/bera/kodiakIslandRouter";

// return swapData bytes
const fetchDelevMimHoneyData = async (
  cauldronObject: CauldronInfo,
  amount: BigNumber,
  slipage: number,
  to: Address
) => {
  //@ts-ignore
  const { collateral, liquidationSwapper, mim } = cauldronObject.contracts;

  const kodiakVaultAddress = cauldronObject.config.wrapInfo!.unwrappedToken.address

  const kodiakVaultAmount = await collateral.convertToAssets(amount);

  const removeLiquidityPreview = await kodiakIslandRouter.removeLiquidityPreview(kodiakVaultAmount, kodiakVaultAddress, to);
};

export default fetchDelevMimHoneyData;
