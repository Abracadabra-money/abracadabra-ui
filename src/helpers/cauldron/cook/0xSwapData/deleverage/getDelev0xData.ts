import type { BigNumber } from "ethers";
import { encodeAbiParameters, type Address } from "viem";
import type { CauldronInfo } from "@/helpers/cauldron/types";
import getDeUsd0xData from "@/helpers/cauldron/cook/0xSwapData/deleverage/fetchDeUSD0xData";
import fetchCvx3pool0xData from "@/helpers/cauldron/cook/0xSwapData/deleverage/fetchCvx3pool";
import fetchUSD0ppOdosData from "@/helpers/cauldron/cook/0xSwapData/deleverage/fetchUSD0ppOdosData";
import fetchDelevBeraBexData from "@/helpers/cauldron/cook/0xSwapData/deleverage/fetchDelevBeraBexData";
import fetchDelevYvWeth0xData from "@/helpers/cauldron/cook/0xSwapData/deleverage/fetchDelevYvWeth0xData";
import getDelevVelodrome0xData from "@/helpers/cauldron/cook/0xSwapData/deleverage/getDelevVelodrome0xData";
import fetchCvxTricrypto0xData from "@/helpers/cauldron/cook/0xSwapData/deleverage/fetchCvxTricrypto0xData";
import fetchDelevMagicGlp0xData from "@/helpers/cauldron/cook/0xSwapData/deleverage/fetchDelevMagicGlp0xData";
import { fetchDelevDefault0xData } from "@/helpers/cauldron/cook/0xSwapData/deleverage/fetchDelevDefault0xData";
import fetchDelevStargateUSDT0xData from "@/helpers/cauldron/cook/0xSwapData/deleverage/fetchDelevStargateUSDT0xData";
import { fetchDelevKodiakIslandData } from "@/helpers/cauldron/cook/0xSwapData/deleverage/fetchDelevKodiakIslandData";

const getDelev0xData = async (
  cauldronObject: CauldronInfo,
  collateralAmount: BigNumber,
  slipage: number,
  to: Address
) => {
  const {
    isMagicGLP,
    isVelodrome,
    isStargateUSDT,
    isYvWethV2,
    isCvxTricrypto,
    isCvx3pool,
    iStdeUSD,
    isUSD0,
    isKodiakIsland,
    isBeraBex,
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

  if (isKodiakIsland) {
    return await fetchDelevKodiakIslandData(
      cauldronObject,
      collateralAmount,
      slipage,
      to
    );
  }

  if (isBeraBex) {
    return await fetchDelevBeraBexData(
      cauldronObject,
      collateralAmount,
      slipage,
      to
    );
  }

  const swapResponseData = await fetchDelevDefault0xData(
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
