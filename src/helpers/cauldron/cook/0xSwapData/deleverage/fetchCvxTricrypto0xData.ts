import { utils } from "ethers";
import { swap0xRequest } from "@/helpers/0x";
import { getCurveWithdrawOneCoinAmount } from "@/helpers/getCurveWithdrawOneCoinAmount";
const usdtAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7";

import type { CauldronInfo } from "@/helpers/cauldron/types";
import type { BigNumber } from "ethers";

const fetchCvxTricrypto0xData = async (
  cauldronObject: CauldronInfo,
  collateralAmount: BigNumber,
  slipage: number
) => {

  //@ts-ignore
  const { liquidationSwapper, mim } = cauldronObject.contracts;

  const selToken = usdtAddress;
  const selAmount = await getCurveWithdrawOneCoinAmount(
    collateralAmount,
    cauldronObject.config.id,
    cauldronObject.config.chainId
  );

  const response = await swap0xRequest(
    cauldronObject.config.chainId,
    mim.address,
    selToken,
    slipage,
    selAmount,
    liquidationSwapper.address
  );

  const usdtTokenIndex = 0;

  return utils.defaultAbiCoder.encode(
    ["uint256", "bytes"],
    //@ts-ignore
    [usdtTokenIndex, response.data]
  );
};

export default fetchCvxTricrypto0xData;
