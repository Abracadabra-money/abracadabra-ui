import { swap0xRequest, swap0xRequestV2 } from "@/helpers/0x";

export const fetchLev0xData = async (cauldronObject, amount, slipage, buyToken) => {
  const { collateral, mim, leverageSwapper } = cauldronObject.contracts;

  const swapResponse = await swap0xRequest(
    cauldronObject.config.chainId,
    buyToken ? buyToken : collateral.address,
    mim.address,
    slipage,
    amount,
    leverageSwapper.address
  );

  console.log("swapResponse", swapResponse);

  console.log("swapResponse.buyA", swapResponse.buyAmount.toString())
  console.log("swapResponse.sellAmount", swapResponse.sellAmount.toString())

  return swapResponse.data;
};

export const fetchLev0xDataV2 = async (cauldronObject, amount, slipage, buyToken) => {
  const { collateral, mim, leverageSwapper } = cauldronObject.contracts;

  const swapResponse = await swap0xRequestV2(
    cauldronObject.config.chainId,
    buyToken ? buyToken : collateral.address,
    mim.address,
    slipage,
    amount,
    leverageSwapper.address
  );
  
  return swapResponse;
};

export default fetchLev0xData;