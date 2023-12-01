import type { BigNumber, providers } from "ethers";
import type { MarketInfo, MarketPrices, DataStoreInfo } from "../types";
import type { Address } from "viem";

import { getMarketVirtualInventory } from "../getMarketInfo";
import { getSwapAmountsByFromValue } from "../trade/swap";

export const getLongToShortSwapAmounts = async (
  market: Address,
  marketInfo: MarketInfo,
  decimals: any,
  prices: MarketPrices,
  dataStoreInfo: DataStoreInfo,
  fromTokenAmount: BigNumber,
  provider: providers.BaseProvider
) => {
  const virtualInventory = await getMarketVirtualInventory(
    provider,
    prices,
    market
  );

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

  const marketInfoData = {
    longTokenAddress: marketInfo.longToken,
    shortTokenAddress: marketInfo.shortToken,
    marketTokenAddress: market,
    prices,
    virtualPoolAmountForLongToken,
    virtualPoolAmountForShortToken,
    longInterestInTokens,
    shortInterestUsd,
    ...dataStoreInfo,
    ...decimals,
  };

  const swapAmounts = getSwapAmountsByFromValue(
    marketInfoData,
    market,
    marketInfo.longToken,
    marketInfo.shortToken,
    fromTokenAmount
  );

  return swapAmounts;
};
