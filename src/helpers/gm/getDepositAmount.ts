import type { Address } from "viem";
import type { BigNumber, providers } from "ethers";

import GMXReaderAbi from "@/utils/abi/gm/GMXReaderAbi";
import { Contract } from "ethers";

import { getContractMarketPrices } from "./getContractMarketPrices";
import { getMarketInfo } from "./getMarketInfo";

import { GMX_READER, DATA_STORE, ZERO_ADDRESS } from "@/constants/gm";
import { applySlippageToMinOut } from "./applySlippageToMinOut";
import { DEFAULT_SLIPPAGE_AMOUNT } from "./applySlippageToMinOut";
import { fetchTokenPrices } from "./fetchTokenPrices";
import type { TokenPriceResponse } from "./types";
import { getDataStoreInfo } from "./getDataStoreInfo";
import { getMintableMarketTokens } from "./utils";

export const getDepositAmount = async (
  market: Address,
  longTokenAmount: BigNumber,
  shortTokenAmount: BigNumber,
  provider: providers.BaseProvider
): Promise<BigNumber> => {
  const GMXReaderContract = new Contract(GMX_READER, GMXReaderAbi, provider);

  const marketInfo = await getMarketInfo(provider, market);

  const uiFeeReceiver = ZERO_ADDRESS;
  const tokenPricesResponse: Array<TokenPriceResponse> = await fetchTokenPrices();
  const prices = getContractMarketPrices(tokenPricesResponse, marketInfo);

  const dataStoreInfo = await getDataStoreInfo(market, marketInfo, provider);

  const {
    shortDepositCapacityAmount,
  } = getMintableMarketTokens(dataStoreInfo)


  if(shortTokenAmount.gt(shortDepositCapacityAmount)) {
    throw new Error('GM Capcity');
  }

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
