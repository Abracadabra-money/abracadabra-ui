import { actions } from "@/helpers/cauldron/cook/actions";
import { getGlpLiqData } from "@/helpers/glpData/getGlpSwapData";
import { swap0xRequest } from "@/helpers/0x";

const usdtAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
const apeAddress = "0x4d224452801ACEd8B2F0aebE155379bb5D594381";


const get0xDeleverageSwapData = async (
  cauldronObject,
  collateralAmount,
  slipage
) => {
  const { isMagicGLP, isVelodrome, isMagicApe, isStargateUSDT } =
    cauldronObject.config.cauldronSettings;

  if (isVelodrome) return "0x00";

  const {
    collateral,
    liquidationSwapper,
    mim: mimContract,
  } = cauldronObject.contracts;
  const swapper = liquidationSwapper.address;
  const mim = mimContract.address;
  let selToken = collateral.address;
  let selAmount = collateralAmount;

  if (isMagicGLP) {
    const deleverageResp = await getGlpLiqData(
      cauldronObject,
      collateralAmount,
      42161,
      slipage
    );
    return deleverageResp.swapDataEncode;
  }

  if (isMagicApe) {
    selToken = apeAddress;
    selAmount = await collateral.convertToAssets(collateralAmount);
  }

  if (isStargateUSDT) selToken = usdtAddress;

  const response = await swap0xRequest(
    cauldronObject.config.chainId,
    mim,
    selToken,
    slipage,
    selAmount,
    swapper
  );
  return response.data;
};

const recipeDeleverage = async (
  cookData,
  cauldronObject,
  shareFrom,
  shareToMin,
  slipage,
  is0x,
  userAddr
) => {
  const {
    collateral,
    mim: mimContract,
    liquidationSwapper,
  } = cauldronObject.contracts;

  const collateralTokenAddr = collateral.address;
  const mim = mimContract.address;
  const swapper = liquidationSwapper.address;
  if (!is0x) {
    const swapStaticTx = await liquidationSwapper.populateTransaction.swap(
      collateralTokenAddr,
      mim,
      userAddr,
      shareToMin,
      shareFrom
    );

    const swapCallByte = swapStaticTx.data;

    cookData = await actions.call(
      cookData,
      swapper,
      swapCallByte,
      false,
      false,
      2
    );

    return cookData;
  }

  const swapData = await get0xDeleverageSwapData(
    cauldronObject,
    shareFrom,
    slipage
  );

  const swapStaticTx = await liquidationSwapper.populateTransaction.swap(
    collateralTokenAddr,
    mim,
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
    swapper,
    swapCallByte,
    false,
    false,
    2
  );

  return cookData;
};

export default recipeDeleverage;