import type { Address } from "viem";
import type { BigNumber } from "ethers";
import { swap0xRequestV2 } from "@/helpers/0x";
import type { CauldronInfo } from "@/helpers/cauldron/types";

export const fetchLev0xData = async (
  cauldronObject: CauldronInfo,
  amount: BigNumber,
  slipage: number,
  buyToken?: Address
) => {
  // @ts-ignore
  const { collateral, mim, leverageSwapper } = cauldronObject.contracts;

  const swapResponse = await swap0xRequestV2(
    cauldronObject.config.chainId,
    buyToken ? buyToken : collateral.address,
    mim.address,
    slipage,
    // @ts-ignore
    amount,
    leverageSwapper!.address
  );

  // @ts-ignore
  return swapResponse;
};
