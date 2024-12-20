import store from "@/store";
import { utils } from "ethers";
import toAmount from "@/helpers/toAmount";
import { swapOdosRequest } from "@/helpers/odos";
import { actions } from "@/helpers/cauldron/cook/actions";

export const recipeDeleverage = async (
  cookData: any,
  pool: any,
  shareFrom: any,
  shareToMin: any,
  slipage: any
) => {
  const { mim, liquidationSwapper, bentoBox } = pool.contracts;

  const userAddr = store.getters.getAccount; // TODO: add to payload

  const sellToken = pool.additionalInfo.gmInfo.marketInfo.shortToken;

  const chainId = pool.config.chainId;

  const amountToSwap = await toAmount(bentoBox, sellToken, shareFrom);

  const swapResponse = await swapOdosRequest(
    chainId,
    mim.address,
    sellToken,
    slipage,
    //@ts-ignore
    amountToSwap,
    liquidationSwapper.address
  );

  const swapData = utils.defaultAbiCoder.encode(
    ["address", "bytes"],
    // @ts-ignore
    [swapResponse.to, swapResponse.data]
  );

  const buyShare = await bentoBox.toShare(
    mim.address,
    // @ts-ignore
    swapResponse.buyAmountWithSlippage,
    false
  );

  const swapStaticTx = await liquidationSwapper.populateTransaction.swap(
    sellToken,
    mim.address,
    userAddr,
    shareToMin.eq(0) ? buyShare : shareToMin,
    shareFrom,
    swapData,
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
