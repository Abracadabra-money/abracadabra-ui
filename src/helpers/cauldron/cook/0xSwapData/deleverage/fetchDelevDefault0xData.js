import { swap0xRequest } from "@/helpers/0x";

const fetchDelevDefault0xData = async (
  cauldronObject,
  collateralAmount,
  slipage
) => {
  const selToken = cauldronObject.config.collateralInfo.address;
  const selAmount = collateralAmount;

  const response = await swap0xRequest(
    cauldronObject.config.chainId,
    cauldronObject.config.mimInfo.address,
    selToken,
    slipage,
    selAmount,
    cauldronObject.config.deleverageInfo.address
  );
  return response.data;
};

export default fetchDelevDefault0xData;
