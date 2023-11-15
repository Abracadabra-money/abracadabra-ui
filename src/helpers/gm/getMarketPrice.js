import { Contract } from "ethers";

import { MAX_PNL_FACTOR_FOR_TRADERS_KEY } from "./fee/dataStore";
import { DATA_STORE, GMX_READER } from "@/constants/gm";
import GMXReaderAbi from "@/utils/abi/gm/GMXReaderAbi";

export const getMarkeTokemPrice = async (marketProps, prices, provider) => {
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

//   const marketTokenPriceMin = await readerContract.getMarketTokenPrice(
//     DATA_STORE,
//     marketProps,
//     prices.indexTokenPrice,
//     prices.longTokenPrice,
//     prices.shortTokenPrice,
//     MAX_PNL_FACTOR_FOR_TRADERS_KEY,
//     false
//   );

  return { marketTokenPriceMax };
};
