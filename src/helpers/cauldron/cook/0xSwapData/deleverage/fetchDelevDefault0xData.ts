import { swap0xRequest } from "@/helpers/0x";

import type { CauldronInfo } from "@/helpers/cauldron/types";
import type { BigNumber } from "ethers";

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
    liquidationSwapper.address
  );

  // @ts-ignore
  return response.data;
};

export default fetchDelevDefault0xData;
