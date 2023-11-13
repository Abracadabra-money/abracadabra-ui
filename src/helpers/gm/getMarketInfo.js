import { Contract } from "ethers";

import { GM_MARKET, DATA_STORE, GMX_READER } from "@/constants/gm";
import GMXReaderAbi from "@/utils/abi/gm/GMXReaderAbi";

export const getMarketInfo = async (provider) => {
  const readerContract = new Contract(GMX_READER, GMXReaderAbi, provider);

  const market = await readerContract.getMarket(DATA_STORE, GM_MARKET);

  return {
    marketToken: market.marketToken,
    indexToken: market.indexToken,
    longToken: market.longToken,
    shortToken: market.shortToken,
  };
};