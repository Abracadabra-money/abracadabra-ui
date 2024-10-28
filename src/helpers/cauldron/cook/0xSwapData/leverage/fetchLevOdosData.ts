import { swapOdosRequest } from "@/helpers/odos";
import type { CauldronInfo } from "@/helpers/cauldron/types";
import type { BigNumber } from "ethers";
import type { Address } from "viem";
export const fetchLevOdosData = async (
  cauldronObject: CauldronInfo,
  amount: BigNumber,
  slipage: number,
  buyToken: Address
) => {
  //@ts-ignore
  const { collateral, mim, leverageSwapper } = cauldronObject.contracts;

  const swapResponse = await swapOdosRequest(
    cauldronObject.config.chainId,
    buyToken ? buyToken : collateral.address as Address,
    mim.address as Address,
    slipage,
    //@ts-ignore
    amount,
    leverageSwapper!.address
  );

  console.log(swapResponse);

  return swapResponse;
};

export default fetchLevOdosData;
