import { swapOdosRequest } from "@/helpers/odos";
import { utils } from "ethers";

import type { CauldronInfo } from "@/helpers/cauldron/types";
import type { BigNumber } from "ethers";

const fetchUSD0ppOdosData = async (
  cauldronObject: CauldronInfo,
  collateralAmount: BigNumber,
  slipage: number
) => {

  //@ts-ignore
  const { collateral, liquidationSwapper, mim } = cauldronObject.contracts;

  const selToken = cauldronObject.config.wrapInfo!.unwrappedToken.address;
  const selAmount = await collateral.convertToAssets(collateralAmount);

  const swapResponse = await swapOdosRequest(
    cauldronObject.config.chainId,
    mim.address,
    selToken,
    slipage,
    selAmount,
    liquidationSwapper.address
  );

  return utils.defaultAbiCoder.encode(
    ["address", "bytes"],
    //@ts-ignore
    [swapResponse.to, swapResponse.data]
  );
};

export default fetchUSD0ppOdosData;
