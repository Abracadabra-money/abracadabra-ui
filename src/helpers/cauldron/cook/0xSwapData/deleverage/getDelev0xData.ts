import getDelevVelodrome0xData from "./getDelevVelodrome0xData";
import fetchDelevDefault0xData from "./fetchDelevDefault0xData";
import fetchDelevMagicApe0xData from "./fetchDelevMagicApe0xData";
import fetchDelevMagicGlp0xData from "./fetchDelevMagicGlp0xData";
import fetchDelevStargateUSDT0xData from "./fetchDelevStargateUSDT0xData";
import fetchDelevYvWeth0xData from "./fetchDelevYvWeth0xData";
import fetchCvx3pool0xData from "./fetchCvx3pool";
import fetchCvxTricrypto0xData from "./fetchCvxTricrypto0xData";
import getDeUsd0xData from "./fetchDeUSD0xData";
import fetchUSD0ppOdosData from "./fetchUSD0ppOdosData";

import type { CauldronInfo } from "@/helpers/cauldron/types.ts";
import type { BigNumber } from "ethers";
import type { Address } from "viem";

const getDelev0xData = async (
  cauldronObject: CauldronInfo,
  collateralAmount: BigNumber,
  slipage: number,
  to: Address
) => {
  const {
    isMagicGLP,
    isVelodrome,
    isMagicApe,
    isStargateUSDT,
    isYvWethV2,
    isCvxTricrypto,
    isCvx3pool,
    iStdeUSD,
    isUSD0,
  } = cauldronObject.config.cauldronSettings;

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

  if (isYvWethV2)
    return await fetchDelevYvWeth0xData(
      cauldronObject,
      collateralAmount,
      slipage,
      to
    );

  if (isCvxTricrypto)
    return await fetchCvxTricrypto0xData(
      cauldronObject,
      collateralAmount,
      slipage
    );

  if (isCvx3pool)
    return await fetchCvx3pool0xData(cauldronObject, collateralAmount, slipage);

  if (iStdeUSD)
    return await getDeUsd0xData(cauldronObject, collateralAmount, slipage);

  if (isUSD0) {
    return await fetchUSD0ppOdosData(cauldronObject, collateralAmount, slipage);
  }

  return await fetchDelevDefault0xData(
    cauldronObject,
    collateralAmount,
    slipage
  );
};

export default getDelev0xData;
