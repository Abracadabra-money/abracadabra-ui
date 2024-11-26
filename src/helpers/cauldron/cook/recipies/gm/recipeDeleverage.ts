import store from "@/store";
import { utils } from "ethers";
import { BigNumber } from "ethers";
import toAmount from "@/helpers/toAmount";
import { USDC_ADDRESS } from "@/constants/gm";
import { swapOdosRequest } from "@/helpers/odos";
import { actions } from "@/helpers/cauldron/cook/actions";

const SLIPPAGE_ACCURACY = 1e4;

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

  const slippagePercentage = slipage / 100;
  //@ts-ignore
  const buyAmountWithSlippage = swapResponse.buyAmount
    .mul(
      BigNumber.from(SLIPPAGE_ACCURACY - slippagePercentage * SLIPPAGE_ACCURACY)
    )
    .div(BigNumber.from(SLIPPAGE_ACCURACY));

  const buyShare = await bentoBox.toShare(
    mim.address,
    buyAmountWithSlippage,
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
