import type {
  TokenPriceResponse,
  MarketInfo,
  DataStoreInfo,
} from "@/helpers/gm/types";
import type { Address } from "viem";
import { fetchTokenPrices } from "@/helpers/gm/fetchTokenPrices";
import { getDataStoreInfo } from "@/helpers/gm/getDataStoreInfo";
import { getEthersProvider } from "@/helpers/chains/getChainsInfo";
import { getMarketInfo, getMarketFullInfo } from "@/helpers/gm/getMarketInfo";

// todo move to viem
export const getGmInfo = async (market: Address, chainId: number) => {
  const provider = getEthersProvider(chainId);

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
