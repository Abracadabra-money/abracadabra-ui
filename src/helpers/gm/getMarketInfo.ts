import { Contract, type providers } from "ethers";
import type { Address } from "viem";
import { MulticallWrapper } from "ethers-multicall-provider";
import type { MarketInfo, MarketPrices } from "./types";

import { DATA_STORE, GMX_READER } from "@/constants/gm";
import GMXReaderAbi from "@/utils/abi/gm/GMXReaderAbi";
import { MAX_PNL_FACTOR_FOR_TRADERS_KEY } from "./fee/dataStore";
import type { TokenPriceResponse } from "./types";
import { getContractMarketPrices } from "./getContractMarketPrices";

export const getMarketInfo = async (
  provider: providers.BaseProvider,
  market: Address
): Promise<MarketInfo> => {
  const readerContract = new Contract(GMX_READER, GMXReaderAbi, provider);

  const marketInfo = await readerContract.getMarket(DATA_STORE, market);

  return {
    marketToken: marketInfo.marketToken,
    indexToken: marketInfo.indexToken,
    longToken: marketInfo.longToken,
    shortToken: marketInfo.shortToken,
  };
};

export const getMarketsPoolValueInfoMin = async (
  provider: providers.BaseProvider,
  pricesResponce: Array<TokenPriceResponse>,
  markets: Array<Address>
) => {
  const multicallProvider = MulticallWrapper.wrap(provider);

  const readerContract = new Contract(
    GMX_READER,
    GMXReaderAbi,
    multicallProvider
  );

  const marketsProps = await Promise.all(
    markets.map((market) => readerContract.getMarket(DATA_STORE, market))
  );

  const marketPrices = markets.map((market, idx) => {
    return getContractMarketPrices(pricesResponce, marketsProps[idx]);
  });

  const marketsPoolValueInfoMin = await Promise.all(
    markets.map((market, index) =>
      readerContract.getMarketTokenPrice(
        DATA_STORE,
        {
          marketToken: marketsProps[index].marketToken,
          indexToken: marketsProps[index].indexToken,
          longToken: marketsProps[index].longToken,
          shortToken: marketsProps[index].shortToken,
        },
        marketPrices[index].indexTokenPrice,
        marketPrices[index].longTokenPrice,
        marketPrices[index].shortTokenPrice,
        MAX_PNL_FACTOR_FOR_TRADERS_KEY,
        false
      )
    )
  );

  return markets.map((market, index) => {
    return {
      market,
      ...marketsPoolValueInfoMin[index],
    };
  });
};

export const getMarketVirtualInventory = async (
  provider: providers.BaseProvider,
  prices: MarketPrices,
  market: Address
) => {
  const readerContract = new Contract(GMX_READER, GMXReaderAbi, provider);

  const marketInfo = await readerContract.getMarketInfo(
    DATA_STORE,
    prices,
    market
  );

  return marketInfo.virtualInventory;
};
