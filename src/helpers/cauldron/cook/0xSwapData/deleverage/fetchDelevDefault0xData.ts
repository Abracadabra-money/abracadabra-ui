import type { BigNumber } from "ethers";
import { swap0xRequestV2 } from "@/helpers/0x";
import type { CauldronInfo } from "@/helpers/cauldron/types";

export const fetchDelevDefault0xData = async (
  cauldronObject: CauldronInfo,
  collateralAmount: BigNumber,
  slipage: number
) => {
  const { collateral, liquidationSwapper, mim } = cauldronObject.contracts;

  const selToken = collateral.address;
  const selAmount = collateralAmount;

  return await swap0xRequestV2(
    cauldronObject.config.chainId,
    mim.address,
    selToken,
    slipage,
    // @ts-ignore
    selAmount,
    liquidationSwapper!.address
  );
};
