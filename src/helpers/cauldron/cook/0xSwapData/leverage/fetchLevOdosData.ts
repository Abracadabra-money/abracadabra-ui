import type { Address } from "viem";
import type { BigNumber } from "ethers";
import { swapOdosRequest } from "@/helpers/odos";
import type { CauldronInfo } from "@/helpers/cauldron/types";

type OdosSwapResponse = {
  to: Address;
  data: Address;
};

export const fetchLevOdosData = async (
  cauldronObject: CauldronInfo,
  amount: BigNumber,
  slipage: number,
  buyToken: Address
): Promise<OdosSwapResponse> => {
  const { collateral, mim, leverageSwapper } = cauldronObject.contracts;

  const swapResponse = await swapOdosRequest(
    cauldronObject.config.chainId,
    buyToken ? buyToken : (collateral.address as Address),
    mim.address as Address,
    slipage,
    //@ts-ignore
    amount,
    leverageSwapper!.address
  );

  return swapResponse as OdosSwapResponse;
};

export default fetchLevOdosData;
