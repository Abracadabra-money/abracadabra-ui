import { USDC_ADDRESS, ORDER_AGENT } from "@/constants/gm";
import toAmount from "@/helpers/toAmount";
import { swap0xRequest } from "@/helpers/0x";

export const recipeLeverage = async (pool: any, amount: any, slipage: any) => {
  const { leverageSwapper, bentoBox, mim } = pool.contracts;
  const chainId = pool.config.chainId; // TODO: check chainId
  const mimAddress = pool.config.mimInfo.address;
  const buyToken = USDC_ADDRESS;

  const shareFrom = await bentoBox.toShare(mimAddress, amount, false);

  // to be sure that sell amount in 0x and amountOut inside call will be same
  const amountToSwap = await toAmount(bentoBox, mimAddress, shareFrom);

  const swapResponse = await swap0xRequest(
    chainId,
    buyToken,
    mim.address,
    slipage,
    //@ts-ignore
    amountToSwap,
    leverageSwapper.address
  );

  //@ts-ignore
  const swapData = swapResponse.data;

  //@ts-ignore
  const minExpected = swapResponse.buyAmountWithSlippage;

  const swapStaticTx = await leverageSwapper.populateTransaction.swap(
    ORDER_AGENT,
    minExpected,
    shareFrom,
    swapData,
    {
      gasLimit: 1000000000,
    }
  );

  return { swapStaticTx, buyAmount: minExpected };
};
