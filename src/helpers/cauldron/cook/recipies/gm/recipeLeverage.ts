import { utils } from "ethers";
import toAmount from "@/helpers/toAmount";
import { swapOdosRequest } from "@/helpers/odos";
import { ORDER_AGENT } from "@/constants/gm";

// import { getSwapTokenByMarket } from "@/helpers/gm/utils";

export const recipeLeverage = async (pool: any, amount: any, slipage: any) => {
  const { leverageSwapper, bentoBox, mim } = pool.contracts;
  const chainId = pool.config.chainId;
  const mimAddress = pool.config.mimInfo.address;

  console.log("recipeLeverage", pool);

  // TODO: condition for different tokens
  const buyToken = pool.additionalInfo.gmInfo.marketInfo.shortToken;
  // const buyToken = getSwapTokenByMarket(pool.config.collateralInfo.address);

  const shareFrom = await bentoBox.toShare(mimAddress, amount, false);

  // to be sure that sell amount in 0x and amountOut inside call will be same
  const amountToSwap: any = await toAmount(bentoBox, mimAddress, shareFrom);

  const swapResponse = await swapOdosRequest(
    chainId,
    buyToken,
    mim.address,
    slipage,
    amountToSwap,
    leverageSwapper.address
  );

  const swapData = utils.defaultAbiCoder.encode(
    ["address", "bytes"],
    // @ts-ignore
    [swapResponse.to, swapResponse.data]
  );

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
