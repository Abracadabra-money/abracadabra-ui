import { USDC_ADDRESS } from "@/constants/gm";
import toAmount from "@/helpers/toAmount";
import { swap0xRequest } from "@/helpers/0x";
import { actions } from "@/helpers/cauldron/cook/actions";
import store from "@/store";

export const recipeDeleverage = async (
  cookData: any,
  pool: any,
  shareFrom: any,
  shareToMin: any,
  slipage: any
) => {
  const { mim, liquidationSwapper, bentoBox } = pool.contracts;

  const userAddr = store.getters.getAccount; // TODO: add to payload
  const sellToken = USDC_ADDRESS;
  const chainId = pool.config.chainId; // TODO: check chainId

  const amountToSwap = await toAmount(bentoBox, sellToken, shareFrom);

  const swapResponse = await swap0xRequest(
    chainId,
    mim.address,
    sellToken,
    slipage,
    //@ts-ignore
    amountToSwap,
    liquidationSwapper.address
  );

  const buyShare = await bentoBox.toShare(
    mim.address,
    //@ts-ignore
    swapResponse.buyAmountWithSlippage,
    false
  );

  const swapStaticTx = await liquidationSwapper.populateTransaction.swap(
    sellToken,
    mim.address,
    userAddr,
    shareToMin.eq(0) ? buyShare : shareToMin,
    shareFrom,
    //@ts-ignore
    swapResponse.data,
    {
      gasLimit: 1000000000,
    }
  );

  const swapCallByte = swapStaticTx.data;

  cookData = await actions.call(
    cookData,
    liquidationSwapper.address,
    swapCallByte,
    false,
    false,
    2
  );

  //@ts-ignore
  return { cookData, buyAmount: swapResponse.buyAmount };
};
