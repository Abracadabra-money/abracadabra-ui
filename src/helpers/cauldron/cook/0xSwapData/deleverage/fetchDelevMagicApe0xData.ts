import { swap0xRequest } from "@/helpers/0x";

const apeAddress = "0x4d224452801ACEd8B2F0aebE155379bb5D594381";

import type { CauldronInfo } from "@/helpers/cauldron/types";
import type { BigNumber } from "ethers";

const fetchDelevMagicApe0xData = async (
  cauldronObject: CauldronInfo,
  collateralAmount: BigNumber,
  slipage: number
) => {
  //@ts-ignore
  const { collateral, liquidationSwapper, mim } = cauldronObject.contracts;

  const selToken = apeAddress;
  const selAmount = await collateral.convertToAssets(collateralAmount);

  const response = await swap0xRequest(
    cauldronObject.config.chainId,
    mim.address,
    selToken,
    slipage,
    selAmount,
    liquidationSwapper!.address
  );

  // @ts-ignore
  return response.data;
};

export default fetchDelevMagicApe0xData;
