import { fetchTokenPrices } from "../gm/fetchTokenPrices";
import { getMarketInfo, getMarketFullInfo } from "../gm/getMarketInfo";
import { getDataStoreInfo } from "../gm/getDataStoreInfo";

import type {
  TokenPriceResponse,
  MarketInfo,
  DataStoreInfo,
} from "../gm/types";
import type { Address } from "viem";
import type { providers } from "ethers";

export const getGmInfo = async (
  market: Address,
  provider: providers.BaseProvider
) => {
  const tokenPricesResponse: Array<TokenPriceResponse> =
    await fetchTokenPrices();
  const marketInfo: MarketInfo = await getMarketInfo(provider, market);
  const dataStoreInfo: DataStoreInfo = await getDataStoreInfo(
    market,
    marketInfo,
    provider
  );

  const marketFullInfo = await getMarketFullInfo(
    provider,
    tokenPricesResponse,
    market,
    marketInfo
  );

  return {
    marketInfo,
    marketFullInfo,
    dataStoreInfo,
    tokenPricesResponse,
  };
};
