import { Contract, type providers, type BigNumber } from "ethers";

import { MAX_PNL_FACTOR_FOR_TRADERS_KEY } from "./fee/dataStore";
import { DATA_STORE, GMX_READER } from "@/constants/gm";
import GMXReaderAbi from "@/utils/abi/gm/GMXReaderAbi";

import type { MarketPrices, MarketInfo } from "./types";

export const getMarketPoolValue = async (
  marketProps: MarketInfo,
  prices: MarketPrices,
  provider: providers.BaseProvider
): Promise<BigNumber> => {
  const readerContract = new Contract(GMX_READER, GMXReaderAbi, provider);

  const marketTokenPriceMax = await readerContract.getMarketTokenPrice(
    DATA_STORE,
    marketProps,
    prices.indexTokenPrice,
    prices.longTokenPrice,
    prices.shortTokenPrice,
    MAX_PNL_FACTOR_FOR_TRADERS_KEY,
    true
  );

  return marketTokenPriceMax[1].poolValue;
};
