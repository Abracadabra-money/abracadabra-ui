import { utils } from "ethers";
import type { BigNumber } from "ethers";
import { encodeAbiParameters } from "viem";
import type { CauldronInfo } from "@/helpers/cauldron/types";
import { fetchLev0xData } from "@/helpers/cauldron/cook/0xSwapData/leverage/fetchLev0xData";
import { fetchLev0xV2Data } from "@/helpers/cauldron/cook/0xSwapData/leverage/fetchLev0xData";
import { fetchLevOdosData } from "@/helpers/cauldron/cook/0xSwapData/leverage/fetchLevOdosData";
import getVelodrome0xData from "@/helpers/cauldron/cook/0xSwapData/leverage/getVelodrome0xData";
import fetchLevSdeusdSwapData from "@/helpers/cauldron/cook/0xSwapData/leverage/fetchLevSdeusdSwapData";
import { fetchLevCvx3poolSwapData } from "@/helpers/cauldron/cook/0xSwapData/leverage/fetchLevCvx3poolSwapData";
import { fetchLevCvxTricryptoSwapData } from "@/helpers/cauldron/cook/0xSwapData/leverage/fetchLevCvxTricryptoSwapData";

const apeAddress = "0x4d224452801ACEd8B2F0aebE155379bb5D594381";
const usdtAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
const wethAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";

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

  if (isMagicApe)
    return await fetchLev0xData(cauldronObject, amount, slipage, apeAddress);

  if (isStargateUSDT)
    return await fetchLev0xData(cauldronObject, amount, slipage, usdtAddress);

  if (isYvWethV2) {
    const swapResponse = await fetchLev0xV2Data(
      cauldronObject,
      amount,
      slipage,
      wethAddress
    );

    return encodeAbiParameters(
      [
        { name: "to", type: "address" },
        { name: "swapData", type: "bytes" },
      ],
      [swapResponse.to, swapResponse.data]
    );
  }

  if (iStdeUSD) {
    return await fetchLevSdeusdSwapData(cauldronObject, amount, slipage);
  }

  if (isCvxTricrypto)
    return await fetchLevCvxTricryptoSwapData(cauldronObject, amount, slipage);

  if (isCvx3pool)
    return await fetchLevCvx3poolSwapData(cauldronObject, amount, slipage);

  if (isUSD0) {
    const responceData = await fetchLevOdosData(
      cauldronObject,
      amount,
      slipage,
      cauldronObject.config.wrapInfo!.unwrappedToken.address
    );

    return utils.defaultAbiCoder.encode(
      ["address", "bytes"],
      // @ts-ignore
      [responceData.to, responceData.data]
    );
  }

  //   return await fetchLev0xData(cauldronObject, amount, slipage);

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
