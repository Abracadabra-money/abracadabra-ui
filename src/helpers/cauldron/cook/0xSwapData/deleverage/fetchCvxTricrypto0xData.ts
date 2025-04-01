import type { BigNumber } from "ethers";
import { encodeAbiParameters } from "viem";
import { swap0xRequestV2 } from "@/helpers/0x";
import type { CauldronInfo } from "@/helpers/cauldron/types";
import { getCurveWithdrawOneCoinAmount } from "@/helpers/getCurveWithdrawOneCoinAmount";

const usdtAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7";

const fetchCvxTricrypto0xData = async (
  cauldronObject: CauldronInfo,
  collateralAmount: BigNumber,
  slipage: number
) => {
  const { liquidationSwapper, mim } = cauldronObject.contracts;

  const selToken = usdtAddress;
  const selAmount = await getCurveWithdrawOneCoinAmount(
    collateralAmount,
    cauldronObject.config.id,
    cauldronObject.config.chainId
  );

  const response = await swap0xRequestV2(
    cauldronObject.config.chainId,
    mim.address,
    selToken,
    slipage,
    selAmount,
    liquidationSwapper!.address
  );

  const poolIndex = 0n;

  return encodeAbiParameters(
    [
      { name: "poolIndex", type: "uint256" },
      { name: "to", type: "address" },
      { name: "swapData", type: "bytes" },
    ],
    [poolIndex, response.to, response.data]
  );
};

export default fetchCvxTricrypto0xData;
