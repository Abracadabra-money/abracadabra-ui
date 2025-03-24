import getDelevVelodrome0xData from "./getDelevVelodrome0xData";
import fetchDelevMagicApe0xData from "./fetchDelevMagicApe0xData";
import fetchDelevMagicGlp0xData from "./fetchDelevMagicGlp0xData";
import fetchDelevStargateUSDT0xData from "./fetchDelevStargateUSDT0xData";
import fetchDelevYvWeth0xData from "./fetchDelevYvWeth0xData";
import fetchCvx3pool0xData from "./fetchCvx3pool";
import fetchCvxTricrypto0xData from "./fetchCvxTricrypto0xData";
import getDeUsd0xData from "./fetchDeUSD0xData";
import fetchUSD0ppOdosData from "./fetchUSD0ppOdosData";
import { fetchDelevDefault0xV2Data } from "@/helpers/cauldron/cook/0xSwapData/deleverage/fetchDelevDefault0xData";
import type { CauldronInfo } from "@/helpers/cauldron/types";
import type { BigNumber } from "ethers";
import { encodeAbiParameters, type Address } from "viem";

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

  // 0x
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

  if (isMagicGLP)
    return await fetchDelevMagicGlp0xData(
      cauldronObject,
      collateralAmount,
      slipage
    );

  // odos

  if (isUSD0)
    return await fetchUSD0ppOdosData(cauldronObject, collateralAmount, slipage);

  if (iStdeUSD)
    return await getDeUsd0xData(cauldronObject, collateralAmount, slipage);

  // 0x v1

  if (isMagicApe)
    return await fetchDelevMagicApe0xData(
      cauldronObject,
      collateralAmount,
      slipage
    );

  const swapResponseData = await fetchDelevDefault0xV2Data(
    cauldronObject,
    collateralAmount,
    slipage
  );

  return encodeAbiParameters(
    [
      { name: "to", type: "address" },
      { name: "swapData", type: "bytes" },
    ],
    [swapResponseData.to, swapResponseData.data]
  );
};

export default getDelev0xData;
