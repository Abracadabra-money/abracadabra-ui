import { Contract, type providers } from "ethers";
import type { Address } from "viem";
import type { MarketInfo, MarketPrices } from "./types";

import { DATA_STORE, GMX_READER } from "@/constants/gm";
import GMXReaderAbi from "@/utils/abi/gm/GMXReaderAbi";

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
