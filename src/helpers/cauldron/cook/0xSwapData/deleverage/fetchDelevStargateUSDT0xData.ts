import { swap0xRequest } from "@/helpers/0x";

const usdtAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7";

import type { CauldronInfo } from "@/helpers/cauldron/types.ts";
import type { BigNumber } from "ethers";

const fetchDelevStargateUSDT0xData = async (
  cauldronObject: CauldronInfo,
  collateralAmount: BigNumber,
  slipage: number
) => {
  //@ts-ignore
  const { liquidationSwapper, mim } = cauldronObject.contracts;

  const selAmount = collateralAmount;
  const selToken = usdtAddress;

  const response = await swap0xRequest(
    cauldronObject.config.chainId,
    mim.address,
    selToken,
    slipage,
    // @ts-ignore
    selAmount,
    liquidationSwapper.address
  );

  // @ts-ignore
  return response.data;
};

export default fetchDelevStargateUSDT0xData;
