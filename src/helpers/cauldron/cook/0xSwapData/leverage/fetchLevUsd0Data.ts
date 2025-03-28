import type { BigNumber } from "ethers";
import { encodeAbiParameters } from "viem";
import type { CauldronInfo } from "@/helpers/cauldron/types";
import { fetchLevOdosData } from "@/helpers/cauldron/cook/0xSwapData/leverage/fetchLevOdosData";

export const fetchLevUsd0Data = async (
  cauldronObject: CauldronInfo,
  collateralAmount: BigNumber,
  slipage: number
) => {
  const swapResponse = await fetchLevOdosData(
    cauldronObject,
    collateralAmount,
    slipage,
    cauldronObject.config.wrapInfo!.unwrappedToken.address
  );

  return encodeAbiParameters(
    [
      { name: "to", type: "address" },
      { name: "swapData", type: "bytes" },
    ],
    [swapResponse.to, swapResponse.data]
  );
};
