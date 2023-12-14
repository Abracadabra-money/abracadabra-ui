import type { Address } from "viem";
import { BigNumber, type providers } from "ethers";

import GMXReaderAbi from "@/utils/abi/gm/GMXReaderAbi";
import { Contract } from "ethers";

import { getContractMarketPrices } from "./getContractMarketPrices";
import { getMarketInfo, getMarketFullInfo } from "./getMarketInfo";

import { GMX_READER, DATA_STORE, ZERO_ADDRESS } from "@/constants/gm";
import { applySlippageToMinOut } from "./applySlippageToMinOut";
import { DEFAULT_SLIPPAGE_AMOUNT } from "./applySlippageToMinOut";
import { fetchTokenPrices } from "./fetchTokenPrices";
import type { TokenPriceResponse } from "./types";
import { getDataStoreInfo } from "./getDataStoreInfo";
import { getMintableMarketTokens } from "./utils";

import { getMarketTokenInfo } from "./getMarketTokenInfo";
import { getDepositAmounts } from "./deposit";

import { getFees } from "./fee/getFees";

export const getDepositAmount = async (
  market: Address,
  longTokenAmount: BigNumber,
  shortTokenAmount: BigNumber,
  provider: providers.BaseProvider
): Promise<BigNumber> => {
  const GMXReaderContract = new Contract(GMX_READER, GMXReaderAbi, provider);

  const marketInfo = await getMarketInfo(provider, market);

  const uiFeeReceiver = ZERO_ADDRESS;
  const tokenPricesResponse: Array<TokenPriceResponse> =
    await fetchTokenPrices();
  const prices = getContractMarketPrices(tokenPricesResponse, marketInfo);

  const dataStoreInfo = await getDataStoreInfo(market, marketInfo, provider);

  const { shortDepositCapacityAmount } = getMintableMarketTokens(dataStoreInfo);

  if (shortTokenAmount.gt(shortDepositCapacityAmount)) {
    throw new Error("GM Capcity");
  }

  const depositAmountOut = await GMXReaderContract.getDepositAmountOut(
    DATA_STORE,
    marketInfo,
    prices,
    longTokenAmount,
    shortTokenAmount,
    uiFeeReceiver
  );

  // alternative calculation
  {
    const marketFullInfo = await getMarketFullInfo(
      provider,
      tokenPricesResponse,
      market
    );

    const marketTokenInfo = getMarketTokenInfo(marketFullInfo, true);

    const { virtualInventory } = marketFullInfo.marketInfo;

    const virtualPoolAmountForLongToken =
      virtualInventory.virtualPoolAmountForLongToken;
    const virtualPoolAmountForShortToken =
      virtualInventory.virtualPoolAmountForShortToken;

    const longInterestInTokens =
      dataStoreInfo.longInterestInTokensUsingLongToken.add(
        dataStoreInfo.longInterestInTokensUsingShortToken
      );

    const shortInterestUsd = dataStoreInfo.shortInterestUsingLongToken.add(
      dataStoreInfo.shortInterestUsingShortToken
    );

    const poolValue = marketFullInfo.marketTokenPriceTradeMax[1].poolValue;

    const marketInfoData = {
      longTokenAddress: marketInfo.longToken,
      shortTokenAddress: marketInfo.shortToken,
      marketTokenAddress: market,
      prices: marketFullInfo.parsedPrices,
      virtualPoolAmountForLongToken,
      virtualPoolAmountForShortToken,
      longInterestInTokens,
      shortInterestUsd,
      longTokenDecimals: marketFullInfo.longTokenDecimals,
      shortTokenDecimals: marketFullInfo.shortTokenDecimals,
      indexTokenDecimals: marketFullInfo.indexTokenDecimals,
      poolValueMax: poolValue,
      ...dataStoreInfo,
    };

    const depositAmounts = getDepositAmounts(
      marketInfoData,
      marketTokenInfo,
      BigNumber.from(0),
      shortTokenAmount,
      "byCollaterals",
      BigNumber.from(0)
    );

    const { fees, isHighPriceImpact } = getFees(depositAmounts, true);
  }

  return applySlippageToMinOut(DEFAULT_SLIPPAGE_AMOUNT, depositAmountOut);
};
