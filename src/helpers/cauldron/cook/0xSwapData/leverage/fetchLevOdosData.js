import { swapOdosRequest } from "@/helpers/odos";

export const fetchLevOdosData = async (cauldronObject, amount, slipage, buyToken) => {
  const { collateral, mim, leverageSwapper } = cauldronObject.contracts;

  const swapResponse = await swapOdosRequest(
    cauldronObject.config.chainId,
    buyToken ? buyToken : collateral.address,
    mim.address,
    slipage,
    amount,
    leverageSwapper.address
  );

  console.log(swapResponse);
  
  return swapResponse;
};

export default fetchLevOdosData;