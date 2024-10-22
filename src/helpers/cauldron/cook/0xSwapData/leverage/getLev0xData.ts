import { utils } from "ethers";
import { fetchLev0xData, fetchLev0xDataV2 } from "./fetchLev0xData";
import { fetchLevOdosData } from "./fetchLevOdosData";

import getVelodrome0xData from "./getVelodrome0xData";

const apeAddress = "0x4d224452801ACEd8B2F0aebE155379bb5D594381";
const usdtAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
const wethAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const deUSDAddress = "0x15700B564Ca08D9439C58cA5053166E8317aa138";

import type { CauldronInfo } from "@/helpers/cauldron/types.ts";
import type { BigNumber } from "ethers";
import type { Address } from "viem";

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

  if (isYvWethV2)
    return await fetchLev0xData(cauldronObject, amount, slipage, wethAddress);

  if (iStdeUSD) {
    const response = await fetchLev0xDataV2(
      cauldronObject,
      amount,
      slipage,
      deUSDAddress
    );

    // @ts-ignore
    const liquidityAvailable = response.response.liquidityAvailable;

    if (!liquidityAvailable) {
      throw new Error("Not enough liquidity available");
    }

    return utils.defaultAbiCoder.encode(
      ["address", "bytes"],
      // @ts-ignore
      [response.to, response.data]
    );
  }

  if (isCvxTricrypto || isCvx3pool) {
    const swapResponseData = await fetchLev0xData(
      cauldronObject,
      amount,
      slipage,
      usdtAddress
    );

    const tokenIndex = isCvx3pool ? 2 : 0;

    return utils.defaultAbiCoder.encode(
      ["address", "uint256", "bytes"],
      [usdtAddress, tokenIndex, swapResponseData]
    );
  }

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

  return await fetchLev0xData(cauldronObject, amount, slipage);
};

export default getLev0xData;
