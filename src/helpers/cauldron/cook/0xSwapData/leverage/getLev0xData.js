import fetchLev0xData from "./fetchLev0xData";
import getVelodrome0xData from "./getVelodrome0xData";

const getLev0xData = async (cauldronObject, amount, slipage) => {
  const { isVelodrome, isMagicApe, isStargateUSDT } =
    cauldronObject.config.cauldronSettings;

  if (isVelodrome) return getVelodrome0xData();
  if (isMagicApe)
    return await fetchLev0xData(cauldronObject, amount, slipage, apeAddress);
  if (isStargateUSDT)
    return await fetchLev0xData(cauldronObject, amount, slipage, usdtAddress);

  return await fetchLev0xData(cauldronObject, amount, slipage);
};

export default getLev0xData;
