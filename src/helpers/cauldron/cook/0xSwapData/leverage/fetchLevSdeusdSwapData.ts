import { utils } from "ethers";
import { swapOdosRequest } from "@/helpers/odos";

import type { CauldronInfo } from "@/helpers/cauldron/types";
import type { BigNumber } from "ethers";
import type { Address } from "viem";

const deUSDAddress = "0x15700B564Ca08D9439C58cA5053166E8317aa138";

const fetchLevSdeusdSwapData = async (
  cauldronObject: CauldronInfo,
  collateralAmount: BigNumber,
  slipage: number
) => {
  // @ts-ignore
  const { mim, leverageSwapper } = cauldronObject.contracts;

  const buyToken = deUSDAddress;

  const swapResponse = await swapOdosRequest(
    cauldronObject.config.chainId,
    buyToken,
    mim.address as Address,
    slipage,
    // @ts-ignore
    collateralAmount,
    leverageSwapper!.address as Address
  );

  return utils.defaultAbiCoder.encode(
    ["address", "bytes"],
    // @ts-ignore
    [swapResponse.to, swapResponse.data]
  );
};

export default fetchLevSdeusdSwapData;
