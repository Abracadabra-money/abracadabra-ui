import { Contract } from "ethers";

import { DATA_STORE, GMX_READER } from "@/constants/gm";
import GMXReaderAbi from "@/utils/abi/gm/GMXReaderAbi";

export const getMarketInfo = async (provider, market) => {
  const readerContract = new Contract(GMX_READER, GMXReaderAbi, provider);

  const marketInfo = await readerContract.getMarket(DATA_STORE, market);

  return {
    marketToken: marketInfo.marketToken,
    indexToken: marketInfo.indexToken,
    longToken: marketInfo.longToken,
    shortToken: marketInfo.shortToken,
  };
};

export const getMarketFullInfo = async (provider, prices, market) => {
  const readerContract = new Contract(GMX_READER, GMXReaderAbi, provider);

  const marketInfo = await readerContract.getMarketInfo(DATA_STORE, prices, market);

  return marketInfo;
};