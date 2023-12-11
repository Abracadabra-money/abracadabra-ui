import { Contract, type providers } from "ethers";
import type { Address } from "viem";
import { MulticallWrapper } from "ethers-multicall-provider";
import type { MarketInfo, MarketPrices } from "./types";

import ERC20 from "@/utils/zeroXSwap/abi/ERC20";
import { DATA_STORE, GMX_READER } from "@/constants/gm";
import GMXReaderAbi from "@/utils/abi/gm/GMXReaderAbi";
import {
  MAX_PNL_FACTOR_FOR_TRADERS_KEY,
  MAX_PNL_FACTOR_FOR_DEPOSITS_KEY,
  MAX_PNL_FACTOR_FOR_WITHDRAWALS_KEY,
} from "./fee/dataStore";
import type { TokenPriceResponse } from "./types";
import {
  getContractMarketPrices,
  parsePrices,
} from "./getContractMarketPrices";

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

export const getMarketFullInfo = async (
  provider: providers.BaseProvider,
  pricesResponce: Array<TokenPriceResponse>,
  market: Address
) => {
  const multicallProvider = MulticallWrapper.wrap(provider);

  const readerContract = new Contract(
    GMX_READER,
    GMXReaderAbi,
    multicallProvider
  );

  const marketProps = await getMarketInfo(provider, market);

  const marketTokenContract = new Contract(
    marketProps.marketToken,
    ERC20,
    multicallProvider
  );

  const shortTokenContract = new Contract(
    marketProps.shortToken,
    ERC20,
    multicallProvider
  );
  const longTokenContract = new Contract(
    marketProps.longToken,
    ERC20,
    multicallProvider
  );

  // notice
  // const indexTokenContract = new Contract(
  //   marketProps.marketToken,
  //   ERC20,
  //   multicallProvider
  // );

  const prices = getContractMarketPrices(pricesResponce, marketProps);

  const [
    totalSupply,
    shortTokenDecimals,
    longTokenDecimals,
    marketInfo,
    marketTokenPriceTradeMin,
    marketTokenPriceTradeMax,
    marketTokenPriceDepositMin,
    marketTokenPriceDepositMax,
    marketTokenPriceWithdrawMin,
    marketTokenPriceWithdrawMax,
  ] = await Promise.all([
    marketTokenContract.totalSupply(),
    shortTokenContract.decimals(),
    longTokenContract.decimals(),
    readerContract.getMarketInfo(DATA_STORE, prices, market),
    readerContract.getMarketTokenPrice(
      DATA_STORE,
      marketProps,
      prices.indexTokenPrice,
      prices.longTokenPrice,
      prices.shortTokenPrice,
      MAX_PNL_FACTOR_FOR_TRADERS_KEY,
      false
    ),
    readerContract.getMarketTokenPrice(
      DATA_STORE,
      marketProps,
      prices.indexTokenPrice,
      prices.longTokenPrice,
      prices.shortTokenPrice,
      MAX_PNL_FACTOR_FOR_TRADERS_KEY,
      true
    ),
    readerContract.getMarketTokenPrice(
      DATA_STORE,
      marketProps,
      prices.indexTokenPrice,
      prices.longTokenPrice,
      prices.shortTokenPrice,
      MAX_PNL_FACTOR_FOR_DEPOSITS_KEY,
      false
    ),
    readerContract.getMarketTokenPrice(
      DATA_STORE,
      marketProps,
      prices.indexTokenPrice,
      prices.longTokenPrice,
      prices.shortTokenPrice,
      MAX_PNL_FACTOR_FOR_DEPOSITS_KEY,
      true
    ),
    readerContract.getMarketTokenPrice(
      DATA_STORE,
      marketProps,
      prices.indexTokenPrice,
      prices.longTokenPrice,
      prices.shortTokenPrice,
      MAX_PNL_FACTOR_FOR_WITHDRAWALS_KEY,
      false
    ),
    readerContract.getMarketTokenPrice(
      DATA_STORE,
      marketProps,
      prices.indexTokenPrice,
      prices.longTokenPrice,
      prices.shortTokenPrice,
      MAX_PNL_FACTOR_FOR_WITHDRAWALS_KEY,
      true
    ),
  ]);

  const indexTokenDecimals = 18;

  const parsedPrices = parsePrices(
    prices,
    indexTokenDecimals,
    longTokenDecimals,
    shortTokenDecimals
  );

  return {
    market,
    parsedPrices,
    marketInfo,
    totalSupply,
    indexTokenDecimals,
    shortTokenDecimals,
    longTokenDecimals,
    marketTokens: marketProps,
    marketTokenPriceTradeMin,
    marketTokenPriceTradeMax,
    marketTokenPriceDepositMin,
    marketTokenPriceDepositMax,
    marketTokenPriceWithdrawMin,
    marketTokenPriceWithdrawMax,
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
