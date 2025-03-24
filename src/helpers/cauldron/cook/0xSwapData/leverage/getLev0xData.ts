import type { BigNumber } from "ethers";
import { encodeAbiParameters } from "viem";
import type { CauldronInfo } from "@/helpers/cauldron/types";
import { fetchLev0xData } from "@/helpers/cauldron/cook/0xSwapData/leverage/fetchLev0xData";
import { fetchLev0xV2Data } from "@/helpers/cauldron/cook/0xSwapData/leverage/fetchLev0xData";
import getVelodrome0xData from "@/helpers/cauldron/cook/0xSwapData/leverage/getVelodrome0xData";
import { fetchLevUsd0Data } from "@/helpers/cauldron/cook/0xSwapData/leverage/fetchLevUsd0Data";
import fetchLevSdeusdSwapData from "@/helpers/cauldron/cook/0xSwapData/leverage/fetchLevSdeusdSwapData";
import { fetchLevYvWethV2Data } from "@/helpers/cauldron/cook/0xSwapData/leverage/fetchLevYvWethV2Data";
import { fetchLevCvx3poolSwapData } from "@/helpers/cauldron/cook/0xSwapData/leverage/fetchLevCvx3poolSwapData";
import { fetchLevStargateUsdtData } from "@/helpers/cauldron/cook/0xSwapData/leverage/fetchLevStargateUsdtData";
import { fetchLevCvxTricryptoSwapData } from "@/helpers/cauldron/cook/0xSwapData/leverage/fetchLevCvxTricryptoSwapData";

const apeAddress = "0x4d224452801ACEd8B2F0aebE155379bb5D594381";

const getLev0xData = async (
  cauldronObject: CauldronInfo,
  amount: BigNumber,
  slipage: number
) => {
  const {
    isVelodrome,
    isMagicApe,
    isStargateUSDT,
    isYvWethV2,
    isCvxTricrypto,
    isCvx3pool,
    iStdeUSD,
    isUSD0,
  } = cauldronObject.config.cauldronSettings;

  if (isVelodrome) return getVelodrome0xData();

  // 0x
  if (isStargateUSDT)
    return await fetchLevStargateUsdtData(cauldronObject, amount, slipage);

  if (isYvWethV2)
    return await fetchLevYvWethV2Data(cauldronObject, amount, slipage);

  if (isCvxTricrypto)
    return await fetchLevCvxTricryptoSwapData(cauldronObject, amount, slipage);

  if (isCvx3pool)
    return await fetchLevCvx3poolSwapData(cauldronObject, amount, slipage);

  // odos
  if (isUSD0) return await fetchLevUsd0Data(cauldronObject, amount, slipage);

  if (iStdeUSD) {
    return await fetchLevSdeusdSwapData(cauldronObject, amount, slipage);
  }

  // 0x v1
  if (isMagicApe)
    return await fetchLev0xData(cauldronObject, amount, slipage, apeAddress);

  const swapResponse = await fetchLev0xV2Data(cauldronObject, amount, slipage);

  return encodeAbiParameters(
    [
      { name: "to", type: "address" },
      { name: "swapData", type: "bytes" },
    ],
    [swapResponse.to, swapResponse.data]
  );
};

export default getLev0xData;
