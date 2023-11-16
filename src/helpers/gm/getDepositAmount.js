import GMXReaderAbi from "@/utils/abi/gm/GMXReaderAbi";
import { Contract } from "ethers";

import { getContractMarketPrices } from "./getContractMarketPrices";
import { getMarketInfo } from "./getMarketInfo";

import { GMX_READER, DATA_STORE, ZERO_ADDRESS } from "@/constants/gm";
import { applySlippageToMinOut } from "./applySlippageToMinOut";
import { DEFAULT_SLIPPAGE_AMOUNT } from "./applySlippageToMinOut";

export const getDepositAmount = async (
  market,
  longTokenAmount,
  shortTokenAmount,
  provider
) => {
  const GMXReaderContract = new Contract(GMX_READER, GMXReaderAbi, provider);

  const marketInfo = await getMarketInfo(provider, market);

  const uiFeeReceiver = ZERO_ADDRESS;
  const prices = await getContractMarketPrices(marketInfo);

  const depositAmountOut = await GMXReaderContract.getDepositAmountOut(
    DATA_STORE,
    marketInfo,
    prices,
    longTokenAmount,
    shortTokenAmount,
    uiFeeReceiver
  );

  return applySlippageToMinOut(DEFAULT_SLIPPAGE_AMOUNT, depositAmountOut);
};
