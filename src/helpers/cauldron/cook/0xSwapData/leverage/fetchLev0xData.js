import { swap0xRequest } from "@/helpers/0x";

const fetchLev0xData = async (cauldronObject, amount, slipage, buyToken) => {
  const { collateral, mim, leverageSwapper } = cauldronObject.contracts;

  const swapResponse = await swap0xRequest(
    cauldronObject.config.chainId,
    buyToken ? buyToken : collateral.address,
    mim.address,
    slipage,
    amount,
    leverageSwapper.address
  );

  return swapResponse.data;
};

export default fetchLev0xData;
