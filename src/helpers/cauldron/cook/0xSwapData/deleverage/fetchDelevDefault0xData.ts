import type { BigNumber } from "ethers";
import type { CauldronInfo } from "@/helpers/cauldron/types";
import { swap0xRequest, swap0xRequestV2 } from "@/helpers/0x";

const fetchDelevDefault0xData = async (
  cauldronObject: CauldronInfo,
  collateralAmount: BigNumber,
  slipage: number
) => {
  //@ts-ignore
  const { collateral, liquidationSwapper, mim } = cauldronObject.contracts;

  const selToken = collateral.address;
  const selAmount = collateralAmount;

  const response = await swap0xRequest(
    cauldronObject.config.chainId,
    mim.address,
    selToken,
    slipage,
    // @ts-ignore
    selAmount,
    liquidationSwapper!.address
  );

  // @ts-ignore
  return response.data;
};

export const fetchDelevDefault0xV2Data = async (
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

export default fetchDelevDefault0xData;
