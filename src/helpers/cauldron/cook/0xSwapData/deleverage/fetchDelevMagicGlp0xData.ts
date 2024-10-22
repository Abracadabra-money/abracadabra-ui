import { getGlpLiqData } from "@/helpers/glpData/getGlpSwapData";

import type { CauldronInfo } from "@/helpers/cauldron/types";
import type { BigNumber } from "ethers";

const fetchDelevMagicGlp0xData = async (
  cauldronObject: CauldronInfo,
  collateralAmount: BigNumber,
  slipage: number
) => {
  const deleverageResp = await getGlpLiqData(
    cauldronObject,
    collateralAmount,
    cauldronObject.config.chainId,
    slipage
  );
  return deleverageResp.swapDataEncode;
};

export default fetchDelevMagicGlp0xData;
