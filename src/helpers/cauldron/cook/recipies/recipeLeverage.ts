import { getGlpLevData } from "@/helpers/glpData/getGlpSwapData";
import { actions } from "@/helpers/cauldron/cook/actions";
import toAmount from "@/helpers/toAmount";

import getLev0xData from "../0xSwapData/leverage/getLev0xData";
import { getOpenoceanLeverageSwapData } from "@/helpers/openocean/getOpenoceanLeverageSwapData";

const recipeBasicLeverage = async (
  cookData: any,
  cauldronObject: any,
  minExpected: any,
  userAddr: string
): Promise<any> => {
  const { leverageSwapper } = cauldronObject.contracts;
  const swapperAddres = leverageSwapper.address;

  const swapStaticTx = await leverageSwapper.populateTransaction.swap(
    userAddr,
    minExpected,
    0
  );

  const swapCallByte = swapStaticTx.data.substr(0, 138);

  cookData = await actions.call(
    cookData,
    swapperAddres,
    swapCallByte,
    false,
    true,
    2
  );

  return cookData;
};

const recipe0xLeverage = async (
  cookData: any,
  cauldronObject: any,
  amount: any,
  minExpected: any,
  slipage: any,
  userAddr: string
): Promise<any> => {
  const { leverageSwapper, bentoBox } = cauldronObject.contracts;
  const mimAddress = cauldronObject.config.mimInfo.address;
  const swapperAddres = leverageSwapper.address;

  const shareFrom = await bentoBox.toShare(mimAddress, amount, false);

  // to be sure that sell amount in 0x and amountOut inside call will be same
  const amountToSwap = await toAmount(bentoBox, mimAddress, shareFrom);

  const swapData = await getLev0xData(cauldronObject, amountToSwap, slipage);

  const swapStaticTx = await leverageSwapper.populateTransaction.swap(
    userAddr,
    minExpected,
    shareFrom,
    swapData,
    {
      gasLimit: 1000000000,
    }
  );

  cookData = await actions.call(
    cookData,
    swapperAddres,
    swapStaticTx.data,
    false,
    false,
    2
  );

  return cookData;
};

const recipeOpenOceanLeverage = async (
  cookData: any,
  cauldronObject: any,
  amount: any,
  minExpected: any,
  slipage: any,
  userAddr: string
): Promise<any> => {
  const { leverageSwapper, bentoBox } = cauldronObject.contracts;
  const mimAddress = cauldronObject.config.mimInfo.address;
  const swapperAddres = leverageSwapper.address;

  const shareFrom = await bentoBox.toShare(mimAddress, amount, false);

  // to be sure that sell amount in 0x and amountOut inside call will be same
  const amountToSwap = await toAmount(bentoBox, mimAddress, shareFrom);

  const swapData = await getOpenoceanLeverageSwapData(
    cauldronObject,
    amountToSwap!.toString(),
    slipage
  );

  const swapStaticTx = await leverageSwapper.populateTransaction.swap(
    userAddr,
    minExpected,
    shareFrom,
    swapData,
    {
      gasLimit: 1000000000,
    }
  );

  cookData = await actions.call(
    cookData,
    swapperAddres,
    swapStaticTx.data,
    false,
    false,
    2
  );

  return cookData;
};

const recipeLeverage = async (
  cookData: any,
  cauldronObject: any,
  amount: any,
  minExpected: any,
  slipage: any,
  is0x: boolean = false,
  isOpenOcean: boolean = false,
  userAddr: string
): Promise<any> => {
  const { isMagicGLP } = cauldronObject.config.cauldronSettings;

  // TODO refactoring magic glp logic to move into recipe0xLeverage
  if (isMagicGLP)
    return await getGlpLevData(
      cookData,
      cauldronObject,
      amount,
      42161,
      slipage
    );

  if (is0x)
    return await recipe0xLeverage(
      cookData,
      cauldronObject,
      amount,
      minExpected,
      slipage,
      userAddr
    );

  if (isOpenOcean)
    return await recipeOpenOceanLeverage(
      cookData,
      cauldronObject,
      amount,
      minExpected,
      slipage,
      userAddr
    );

  return await recipeBasicLeverage(
    cookData,
    cauldronObject,
    minExpected,
    userAddr
  );
};

export default recipeLeverage;
