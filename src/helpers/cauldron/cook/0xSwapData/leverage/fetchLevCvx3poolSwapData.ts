import type { BigNumber } from "ethers";
import { encodeAbiParameters } from "viem";
import type { CauldronInfo } from "@/helpers/cauldron/types";
import { fetchLev0xData } from "@/helpers/cauldron/cook/0xSwapData/leverage/fetchLev0xData";

const usdtAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7";

export const fetchLevCvx3poolSwapData = async (
  cauldronObject: CauldronInfo,
  collateralAmount: BigNumber,
  slipage: number
) => {
  const swapResponseData = await fetchLev0xData(
    cauldronObject,
    collateralAmount,
    slipage,
    usdtAddress
  );

  console.log("swapResponseData", swapResponseData);

  const poolIndex = 2n;

  return encodeAbiParameters(
    [
      { name: "underlyingToken", type: "address" },
      { name: "poolIndex", type: "uint256" },
      { name: "to", type: "address" },
      { name: "swapData", type: "bytes" },
    ],
    [usdtAddress, poolIndex, swapResponseData.to, swapResponseData.data]
  );
};
