import { utils } from "ethers";
import { swap0xRequestV2 } from "@/helpers/0x";

import type { CauldronInfo } from "@/helpers/cauldron/types.ts";
import type { BigNumber } from "ethers";

const getDeUsd0xData = async (
  cauldronObject: CauldronInfo,
  collateralAmount: BigNumber,
  slipage: number
) => {
  //@ts-ignore
  const { mim, liquidationSwapper, collateral } = cauldronObject.contracts;

  const response = await swap0xRequestV2(
    cauldronObject.config.chainId,
    mim.address,
    collateral.address,
    slipage,
    // @ts-ignore
    collateralAmount,
    liquidationSwapper.address
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
};

export default getDeUsd0xData;
