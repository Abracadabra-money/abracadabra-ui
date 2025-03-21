import type { BigNumber } from "ethers";
import { encodeAbiParameters } from "viem";
import type { CauldronInfo } from "@/helpers/cauldron/types";
import { fetchLev0xV2Data } from "@/helpers/cauldron/cook/0xSwapData/leverage/fetchLev0xData";

const wethAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";

export const fetchLevYvWethV2Data = async (
  cauldronObject: CauldronInfo,
  collateralAmount: BigNumber,
  slipage: number
) => {
  const swapResponse = await fetchLev0xV2Data(
    cauldronObject,
    collateralAmount,
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
};
