import { getGlpLevData } from "@/helpers/glpData/getGlpSwapData";
import { actions } from "@/helpers/cauldron/cook/actions";
import toAmount from "@/helpers/toAmount";
import { swap0xRequest } from "@/helpers/0x";

const usdtAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
const apeAddress = "0x4d224452801ACEd8B2F0aebE155379bb5D594381";

const get0xLeverageSwapData = async (cauldronObject, amount, slipage) => {
  const { isMagicGLP, isVelodrome, isMagicApe, isStargateUSDT } =
    cauldronObject.config.cauldronSettings;

  if (isVelodrome) return "0x00";

  const { collateral, mim, leverageSwapper } = cauldronObject.contracts;

  let buyToken = collateral.address;
  if (isMagicGLP) {
    const leverageResp = await getGlpLevData(
      this.signer, // TODO
      cauldronObject,
      amount,
      42161,
      slipage
    );
    return leverageResp.swapDataEncode;
  }
  if (isMagicApe) buyToken = apeAddress;

  if (isStargateUSDT) buyToken = usdtAddress;

  const swapResponse = await swap0xRequest(
    cauldronObject.config.chainId,
    buyToken,
    mim.address,
    slipage,
    amount,
    leverageSwapper.address
  );

  return swapResponse.data;
};

const recipeLeverage = async (
  cookData,
  cauldronObject,
  amount,
  minExpected,
  slipage,
  is0x = false
) => {
  const { leverageSwapper, bentoBox } = cauldronObject.contracts;
  const mimAddress = cauldronObject.config.mimInfo.address;
  const swapperAddres = leverageSwapper.address;
  const userAddr = this.account; // TODO

  const { isMagicGLP } = cauldronObject.config.cauldronSettings;

  if (isMagicGLP)
    return await getGlpLevData(
      cookData,
      this.signer, // TODO
      cauldronObject,
      amount,
      42161,
      slipage
    );

  if (!is0x) {
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
  }

  const shareFrom = await bentoBox.toShare(mimAddress, amount, false);

  // to be sure that sell amount in 0x and amountOut inside call will be same
  const amountToSwap = await toAmount(bentoBox, mimAddress, shareFrom);

  const swapData = await get0xLeverageSwapData(
    cauldronObject,
    amountToSwap,
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

export default recipeLeverage;
