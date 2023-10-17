import { swap0xRequest } from "@/helpers/0x";

const fetchDelevDefault0xData = async (
  cauldronObject,
  collateralAmount,
  slipage
) => {
  const { collateral, liquidationSwapper } = cauldronObject.contracts;

  const selToken = collateral.address;
  const selAmount = collateralAmount;

  const response = await swap0xRequest(
    cauldronObject.config.chainId,
    mim.address,
    selToken,
    slipage,
    selAmount,
    liquidationSwapper.address
  );
  return response.data;
};

export default fetchDelevDefault0xData;
