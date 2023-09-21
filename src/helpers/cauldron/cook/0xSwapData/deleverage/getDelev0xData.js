import getDelevVelodrome0xData from "./getDelevVelodrome0xData";
import fetchDelevDefault0xData from "./fetchDelevDefault0xData";
import fetchDelevMagicApe0xData from "./fetchDelevMagicApe0xData";
import fetchDelevMagicGlp0xData from "./fetchDelevMagicGlp0xData";
import fetchDelevStargateUSDT0xData from "./fetchDelevStargateUSDT0xData";

const getDelev0xData = async (cauldronObject, collateralAmount, slipage) => {
  const { isMagicGLP, isVelodrome, isMagicApe, isStargateUSDT } =
    cauldronObject.config.cauldronSettings;

  if (isVelodrome) return getDelevVelodrome0xData();

  if (isMagicGLP)
    return await fetchDelevMagicGlp0xData(
      cauldronObject,
      collateralAmount,
      slipage
    );

  if (isMagicApe)
    return await fetchDelevMagicApe0xData(
      cauldronObject,
      collateralAmount,
      slipage
    );

  if (isStargateUSDT)
    return await fetchDelevStargateUSDT0xData(
      cauldronObject,
      collateralAmount,
      slipage
    );

  return await fetchDelevDefault0xData(
    cauldronObject,
    collateralAmount,
    slipage
  );
};

export default getDelev0xData;
