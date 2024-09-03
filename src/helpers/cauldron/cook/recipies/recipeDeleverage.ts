import { actions } from "@/helpers/cauldron/cook/actions";
import getDelev0xData from "../0xSwapData/deleverage/getDelev0xData";

const recipe0xDeleverage = async (
  cookData: any,
  cauldronObject: any,
  shareFrom: any,
  shareToMin: any,
  slipage: any,
  userAddr: string
): Promise<any> => {
  const { collateral, mim, liquidationSwapper } = cauldronObject.contracts;

  const swapData = await getDelev0xData(
    cauldronObject,
    shareFrom,
    slipage,
    userAddr
  );

  const swapStaticTx = await liquidationSwapper.populateTransaction.swap(
    collateral.address,
    mim.address,
    userAddr,
    shareToMin,
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

  return cookData;
};

const recipeBasicDeleverage = async (
  cookData: any,
  cauldronObject: any,
  shareFrom: any,
  shareToMin: any,
  userAddr: string
): Promise<any> => {
  const { collateral, mim, liquidationSwapper } = cauldronObject.contracts;

  const swapStaticTx = await liquidationSwapper.populateTransaction.swap(
    collateral.address,
    mim.address,
    userAddr,
    shareToMin,
    shareFrom
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

  return cookData;
};

const recipeDeleverage = async (
  cookData: any,
  cauldronObject: any,
  shareFrom: any,
  shareToMin: any,
  slipage: any,
  is0x: boolean,
  userAddr: string
): Promise<any> => {
  if (is0x)
    return await recipe0xDeleverage(
      cookData,
      cauldronObject,
      shareFrom,
      shareToMin,
      slipage,
      userAddr
    );

  return await recipeBasicDeleverage(
    cookData,
    cauldronObject,
    shareFrom,
    shareToMin,
    userAddr
  );
};

export default recipeDeleverage;
