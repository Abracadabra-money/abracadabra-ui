import { swap0xRequest } from "@/helpers/0x";

const apeAddress = "0x4d224452801ACEd8B2F0aebE155379bb5D594381";

const fetchDelevMagicApe0xData = async (
  cauldronObject,
  collateralAmount,
  slipage
) => {
  const { collateral } = cauldronObject.contracts;

  const selToken = apeAddress;
  const selAmount = await collateral.convertToAssets(collateralAmount);

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

export default fetchDelevMagicApe0xData;
