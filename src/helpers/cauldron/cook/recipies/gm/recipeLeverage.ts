import { utils } from "ethers";
import { BigNumber } from "ethers";
import toAmount from "@/helpers/toAmount";
import { swapOdosRequest } from "@/helpers/odos";
import { USDC_ADDRESS, ORDER_AGENT } from "@/constants/gm";

export const recipeLeverage = async (pool: any, amount: any, slipage: any) => {
  const { leverageSwapper, bentoBox, mim } = pool.contracts;
  const chainId = pool.config.chainId;
  const mimAddress = pool.config.mimInfo.address;
  const buyToken = USDC_ADDRESS;
  const SLIPPAGE_ACCURACY = 1e4;

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

  const slippagePercentage = slipage / 100;

  //@ts-ignore
  const minExpected = swapResponse.buyAmount
    .mul(
      BigNumber.from(SLIPPAGE_ACCURACY - slippagePercentage * SLIPPAGE_ACCURACY)
    )
    .div(BigNumber.from(SLIPPAGE_ACCURACY));

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
