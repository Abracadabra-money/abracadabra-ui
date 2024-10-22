import { swap0xRequest, swap0xRequestV2 } from "@/helpers/0x";

import type { CauldronInfo } from "@/helpers/cauldron/types";
import type { BigNumber } from "ethers";
import type { Address } from "viem";

export const fetchLev0xData = async (
  cauldronObject: CauldronInfo,
  amount: BigNumber,
  slipage: number,
  buyToken?: Address
) => {
  //@ts-ignore
  const { collateral, mim, leverageSwapper } = cauldronObject.contracts;

  const swapResponse = await swap0xRequest(
    cauldronObject.config.chainId,
    buyToken ? buyToken : collateral.address,
    mim.address,
    slipage,
    // @ts-ignore
    amount,
    leverageSwapper.address
  );

  // @ts-ignore
  return swapResponse.data;
};

export const fetchLev0xDataV2 = async (
  cauldronObject: CauldronInfo,
  amount: BigNumber,
  slipage: number,
  buyToken: Address
) => {
  // @ts-ignore
  const { collateral, mim, leverageSwapper } = cauldronObject.contracts;

  const swapResponse = await swap0xRequestV2(
    cauldronObject.config.chainId,
    buyToken ? buyToken : collateral.address,
    mim.address,
    slipage,
    // @ts-ignore
    amount,
    leverageSwapper.address
  );

  return swapResponse;
};

export default fetchLev0xData;
