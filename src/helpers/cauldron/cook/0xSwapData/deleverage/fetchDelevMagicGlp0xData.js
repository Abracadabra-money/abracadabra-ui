import { getGlpLiqData } from "@/helpers/glpData/getGlpSwapData";

const fetchDelevMagicGlp0xData = async (
  cauldronObject,
  collateralAmount,
  slipage
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
