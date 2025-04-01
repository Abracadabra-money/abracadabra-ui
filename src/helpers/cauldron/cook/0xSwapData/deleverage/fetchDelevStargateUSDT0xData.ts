import type { BigNumber } from "ethers";
import { encodeAbiParameters } from "viem";
import { swap0xRequestV2 } from "@/helpers/0x";
import type { CauldronInfo } from "@/helpers/cauldron/types";

const usdtAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7";

const fetchDelevStargateUSDT0xData = async (
  cauldronObject: CauldronInfo,
  collateralAmount: BigNumber,
  slipage: number
) => {
  const { liquidationSwapper, mim } = cauldronObject.contracts;

  const selAmount = collateralAmount;
  const selToken = usdtAddress;

  const swapResponse = await swap0xRequestV2(
    cauldronObject.config.chainId,
    mim.address,
    selToken,
    slipage,
    // @ts-ignore
    selAmount,
    liquidationSwapper!.address
  );

  return encodeAbiParameters(
    [
      { name: "to", type: "address" },
      { name: "swapData", type: "bytes" },
    ],
    [swapResponse.to, swapResponse.data]
  );
};

export default fetchDelevStargateUSDT0xData;
